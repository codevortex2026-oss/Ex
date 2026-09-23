from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from pathlib import Path
from datetime import datetime, timezone
import os
import logging

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")


class WaitlistEntry(BaseModel):
    email: EmailStr


@api_router.get("/")
async def root():
    return {"message": "EXHILARATION landing API"}


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

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
