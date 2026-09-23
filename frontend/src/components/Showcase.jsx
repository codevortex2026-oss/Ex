import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import axios from "axios";
import { API, TICKETS_URL } from "../config";

const formatDate = (iso) => {
    try {
        return new Date(iso)
            .toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })
            .toUpperCase();
    } catch {
        return "TBA";
    }
};

export default function Showcase() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState("ALL");

    useEffect(() => {
        axios
            .get(`${API}/events`)
            .then((r) => setEvents(r.data.events || []))
            .catch(() => setEvents([]))
            .finally(() => setLoading(false));
    }, []);

    const genres = useMemo(
        () => ["ALL", ...new Set(events.map((e) => e.genre).filter(Boolean))],
        [events]
    );
    const filtered = active === "ALL" ? events : events.filter((e) => e.genre === active);

    return (
        <section id="events" className="py-24 px-6 md:px-12 lg:px-20 bg-[#0C0C0F] border-y border-white/10" data-testid="events-section">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
                >
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4" data-testid="events-eyebrow">
                            Upcoming Raves
                        </p>
                        <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl max-w-xl" data-testid="events-heading">
                            Next up: Ragetrain, all night long.
                        </h2>
                    </div>
                    <p className="text-xs text-[#8F909A] max-w-xs leading-relaxed" data-testid="events-sync-note">
                        Synced automatically from the official Skiddle page — new dates appear here the moment they drop.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8 }}
                    className="bg-[#111115] border border-[#22222B] clip-corner overflow-hidden"
                    data-testid="events-board"
                >
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#22222B] bg-[#0C0C0F]">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF2B56]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#CCFF00]/60" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                        <span className="ml-4 text-[10px] tracking-[0.25em] uppercase text-[#8F909A]">
                            skiddle.com/g/exhilaration-
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 px-5 py-4 border-b border-[#22222B]" role="tablist" aria-label="Genre filters">
                        {genres.map((g) => (
                            <button
                                key={g}
                                role="tab"
                                aria-selected={active === g}
                                data-testid={`filter-${g.toLowerCase().replace(/\s+/g, "-")}-btn`}
                                onClick={() => setActive(g)}
                                className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors duration-300 clip-corner-sm ${
                                    active === g
                                        ? "bg-[#CCFF00] text-[#08080A] border-[#CCFF00] font-bold"
                                        : "border-white/15 text-[#8F909A] hover:border-[#CCFF00]/50 hover:text-[#F4F4F6]"
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>

                    <div className="divide-y divide-[#22222B]" data-testid="event-list">
                        {loading && (
                            <div className="px-5 py-10 text-center" data-testid="events-loading">
                                <p className="text-xs tracking-[0.25em] uppercase text-[#8F909A] animate-pulse">
                                    Tuning into Skiddle...
                                </p>
                            </div>
                        )}
                        <AnimatePresence mode="popLayout">
                            {!loading && filtered.map((e) => (
                                <motion.div
                                    key={e.url}
                                    layout
                                    initial={{ opacity: 0, x: -24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 24 }}
                                    transition={{ duration: 0.35 }}
                                    className="group flex items-center justify-between gap-4 px-5 py-5 hover:bg-[#CCFF00]/[0.04] transition-colors duration-300"
                                    data-testid={`event-card-${e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                >
                                    <div className="flex items-center gap-5 min-w-0">
                                        {e.image ? (
                                            <img
                                                src={e.image}
                                                alt={`${e.name} flyer`}
                                                loading="lazy"
                                                className="hidden sm:block w-16 h-16 shrink-0 object-cover clip-corner-sm border border-[#22222B]"
                                                data-testid="event-flyer"
                                            />
                                        ) : (
                                            <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 shrink-0 border border-[#22222B] text-center">
                                                <CalendarDays size={12} className="text-[#CCFF00]" aria-hidden="true" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="font-display font-bold uppercase tracking-tight text-lg sm:text-xl group-hover:text-[#CCFF00] transition-colors duration-300">
                                                {e.name}
                                            </h3>
                                            <p className="text-xs text-[#8F909A] flex items-center gap-1.5 mt-1">
                                                <MapPin size={11} aria-hidden="true" />
                                                {e.venue} · {formatDate(e.startDate)}
                                                {e.price && <span className="text-[#CCFF00]/80">· from £{e.price}</span>}
                                            </p>
                                            {e.lineup && e.lineup.length > 0 && (
                                                <p className="text-[10px] tracking-[0.2em] uppercase text-[#CCFF00]/70 mt-1.5">
                                                    Line-up — {e.lineup.join(" · ")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="hidden md:inline text-[10px] tracking-[0.2em] text-[#FF2B56] border border-[#FF2B56]/40 px-2.5 py-1">
                                            {e.genre}
                                        </span>
                                        <a
                                            href={e.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            data-testid={`event-tickets-${e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                            className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-[#F4F4F6] group-hover:text-[#CCFF00] transition-colors duration-300"
                                        >
                                            Tickets
                                            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                            {!loading && filtered.length === 0 && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="px-5 py-10 text-center"
                                    data-testid="events-empty-state"
                                >
                                    <p className="text-xs tracking-[0.25em] uppercase text-[#8F909A]">
                                        No {active === "ALL" ? "" : `${active.toLowerCase()} `}dates announced yet —{" "}
                                        <a href="#notify" className="text-[#CCFF00] underline underline-offset-4" data-testid="events-empty-notify-link">
                                            get notified
                                        </a>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="px-5 py-4 border-t border-[#22222B] bg-[#0C0C0F] flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8F909A]">Source: Skiddle · auto-synced</span>
                        <a
                            href={TICKETS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="events-follow-brand-link"
                            className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-[#CCFF00] hover:text-[#F4F4F6] transition-colors duration-300"
                        >
                            Follow the brand
                            <ArrowUpRight size={14} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
