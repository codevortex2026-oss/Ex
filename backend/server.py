import os
import re
import json
import asyncio
import ipaddress
import logging
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
MAILGUN_KEY = os.environ["MAILGUN_API_KEY"]
MAILGUN_DOMAIN = os.environ["MAILGUN_DOMAIN"]
MAILGUN_FROM = os.environ["MAILGUN_FROM"]
SITE_URL = os.environ.get("SITE_URL", "")
SKIDDLE_BRAND_URL = os.environ["SKIDDLE_BRAND_URL"]
SYNC_SECRET = os.environ["SYNC_SECRET"]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ---------- Email guardrail gate (G2/G3 structural) ----------
_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    form = [
        ("from", (None, MAILGUN_FROM)),
        ("to", (None, to)),
        ("subject", (None, subject)),
        ("html", (None, html)),
    ]
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
                auth=("api", MAILGUN_KEY),
                files=form,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as e:
        logger.error(f"Email send error to {to}: {e}")
        return None


# ---------- Skiddle sync ----------
def _walk_jsonld(node, out):
    if isinstance(node, dict):
        t = node.get("@type")
        if t in ("MusicEvent", "Event") and node.get("startDate") and node.get("url"):
            out.append(node)
        for v in node.values():
            _walk_jsonld(v, out)
    elif isinstance(node, list):
        for v in node:
            _walk_jsonld(v, out)


def _guess_genre(text: str) -> str:
    low = (text or "").lower()
    if "trance" in low:
        return "TRANCE"
    if "acid" in low:
        return "ACID"
    if "industrial" in low:
        return "INDUSTRIAL"
    return "HARD TECHNO"


def _parse_events(html_text: str) -> list[dict]:
    events = []
    for m in re.finditer(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html_text,
        re.DOTALL | re.IGNORECASE,
    ):
        try:
            data = json.loads(m.group(1).strip())
        except Exception:
            continue
        _walk_jsonld(data, events)
    parsed = []
    for e in events:
        offers = e.get("offers") or []
        offer = offers[0] if isinstance(offers, list) and offers else (offers if isinstance(offers, dict) else {})
        performers = e.get("performer") or []
        if isinstance(performers, dict):
            performers = [performers]
        loc = e.get("location") or {}
        parsed.append({
            "url": e["url"],
            "name": e.get("name", "EXHILARATION"),
            "startDate": e.get("startDate"),
            "endDate": e.get("endDate"),
            "image": e.get("image"),
            "description": (e.get("description") or "")[:400],
            "venue": loc.get("name", "Liverpool"),
            "city": (loc.get("address") or {}).get("addressLocality", "Liverpool"),
            "lineup": [p.get("name") for p in performers if isinstance(p, dict) and p.get("name")],
            "price": offer.get("price"),
            "currency": offer.get("priceCurrency", "GBP"),
            "availability": offer.get("availability", ""),
            "genre": _guess_genre(f"{e.get('name','')} {e.get('description','')}"),
        })
    return parsed


async def sync_events() -> dict:
    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client_http:
        resp = await client_http.get(
            SKIDDLE_BRAND_URL,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
        )
        resp.raise_for_status()
    events = _parse_events(resp.text)
    existing_count = await db.events.count_documents({})
    now = datetime.now(timezone.utc).isoformat()
    added, updated = [], 0
    for ev in events:
        found = await db.events.find_one({"url": ev["url"]})
        if found:
            await db.events.update_one({"url": ev["url"]}, {"$set": {**ev, "syncedAt": now}})
            updated += 1
        else:
            await db.events.insert_one({**ev, "syncedAt": now, "announced": existing_count == 0})
            added.append(ev)
    if added and existing_count > 0:
        await announce_events(added)
        await db.events.update_many(
            {"url": {"$in": [e["url"] for e in added]}}, {"$set": {"announced": True}}
        )
    logger.info(f"Skiddle sync: {len(events)} found, {len(added)} added, {updated} updated")
    return {"found": len(events), "added": len(added), "updated": updated}


def _announcement_html(ev: dict) -> str:
    try:
        dt = datetime.fromisoformat(ev["startDate"])
        date_str = dt.strftime("%a %d %b %Y · %H:%M")
    except Exception:
        date_str = ev.get("startDate", "")
    lineup = ", ".join(ev.get("lineup") or []) or ev["name"]
    price = f" from £{ev['price']}" if ev.get("price") else ""
    return (
        '<table role="presentation" width="100%" style="background:#08080A;padding:32px 0">'
        '<tr><td align="center"><table role="presentation" width="560" style="background:#111115;'
        'border:1px solid #22222B;font-family:Arial,sans-serif;color:#F4F4F6">'
        '<tr><td style="padding:28px">'
        '<p style="color:#CCFF00;font-size:11px;letter-spacing:3px;margin:0 0 12px">NEW RAVE ANNOUNCED</p>'
        f'<h1 style="font-size:26px;margin:0 0 8px;text-transform:uppercase">{escape(ev["name"])}</h1>'
        f'<p style="margin:0 0 4px;color:#F4F4F6">{escape(date_str)}</p>'
        f'<p style="margin:0 0 4px;color:#8F909A">{escape(ev.get("venue", ""))} · {escape(ev.get("city", ""))}</p>'
        f'<p style="margin:0 0 4px;color:#8F909A">Line-up: {escape(lineup)}</p>'
        f'<p style="margin:0 0 20px;color:#8F909A">Tickets{escape(price)} via Skiddle</p>'
        f'<a href="{escape(SITE_URL)}/#events" style="display:inline-block;background:#CCFF00;color:#08080A;'
        'padding:14px 28px;text-decoration:none;font-weight:bold;text-transform:uppercase;'
        'letter-spacing:2px;font-size:13px">See the line-up</a>'
        f'<p style="font-size:11px;color:#8F909A;margin:24px 0 0">Sent by {escape(EMAIL_FROM_NAME)} because you '
        'joined the notify list. We never ask for your password or card details by email.</p>'
        "</td></tr></table></td></tr></table>"
    )


async def announce_events(events: list[dict]) -> None:
    subscribers = await db.waitlist.find({}, {"_id": 0, "email": 1}).to_list(10000)
    if not subscribers:
        return
    for ev in events:
        subject = f"New rave announced: {ev['name']}"
        html = _announcement_html(ev)
        for sub in subscribers:
            await send_email(to=sub["email"], subject=subject, html=html)
    logger.info(f"Announced {len(events)} event(s) to {len(subscribers)} subscriber(s)")


async def _sync_loop():
    while True:
        try:
            await sync_events()
        except Exception as e:
            logger.error(f"Sync failed: {e}")
        await asyncio.sleep(6 * 60 * 60)


# ---------- Routes ----------
class WaitlistEntry(BaseModel):
    email: EmailStr


@api_router.get("/")
async def root():
    return {"message": "EXHILARATION API"}


@api_router.get("/events")
async def list_events():
    now = datetime.now(timezone.utc).isoformat()
    docs = await db.events.find(
        {"endDate": {"$gte": now}}, {"_id": 0}
    ).sort("startDate", 1).to_list(100)
    return {"events": docs, "syncedCount": len(docs)}


@api_router.post("/admin/sync")
async def force_sync(x_sync_secret: str = Header(default="")):
    if x_sync_secret != SYNC_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")
    return await sync_events()


@api_router.post("/waitlist")
async def join_waitlist(entry: WaitlistEntry):
    email = entry.email.lower().strip()
    existing = await db.waitlist.find_one({"email": email})
    if existing:
        return {"status": "already", "message": "Already on the list"}
    await db.waitlist.insert_one(
        {"email": email, "joined_at": datetime.now(timezone.utc).isoformat()}
    )
    count = await db.waitlist.count_documents({})
    return {"status": "ok", "message": "You're in", "count": count}


@api_router.get("/waitlist/count")
async def waitlist_count():
    count = await db.waitlist.count_documents({})
    return {"count": count}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_tasks():
    asyncio.create_task(_sync_loop())


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
