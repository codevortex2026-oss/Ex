import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { API } from "../config";

export default function Waitlist() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(null);

    useEffect(() => {
        axios
            .get(`${API}/waitlist/count`)
            .then((r) => setCount(r.data.count))
            .catch(() => {});
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            const r = await axios.post(`${API}/waitlist`, { email });
            if (r.data.status === "ok") {
                setCount(r.data.count);
                toast.success("YOU'RE IN.", {
                    description: "First dibs on drops, lineups and guest lists.",
                });
                setEmail("");
            } else {
                toast.info("Already on the list.", {
                    description: "This email is already locked in.",
                });
            }
        } catch {
            toast.error("Signal lost.", { description: "Try again in a moment." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="notify" className="py-24 px-6 md:px-12 lg:px-20" data-testid="waitlist-section">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8 }}
                    className="relative bg-[#111115] border border-[#22222B] clip-corner px-6 py-14 sm:px-12 lg:px-20 overflow-hidden"
                >
                    <div
                        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#CCFF00]/10 blur-3xl"
                        aria-hidden="true"
                    />
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4" data-testid="waitlist-eyebrow">
                                04 · Stay on Frequency
                            </p>
                            <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl" data-testid="waitlist-heading">
                                Lineup drops hit your inbox first.
                            </h2>
                            <p className="mt-4 text-sm text-[#8F909A] leading-relaxed max-w-md">
                                Announcements, secret sets and pre-sale windows — straight to you before
                                the general scramble.
                                {count !== null && count > 0 && (
                                    <span className="text-[#CCFF00]" data-testid="waitlist-count">
                                        {" "}
                                        {count.toLocaleString()} already locked in.
                                    </span>
                                )}
                            </p>
                        </div>

                        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3" data-testid="waitlist-form">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="YOUR@EMAIL.COM"
                                data-testid="waitlist-email-input"
                                className="grow bg-[#08080A] border border-[#22222B] focus:border-[#CCFF00] outline-none px-5 py-4 text-sm tracking-widest uppercase placeholder:text-[#8F909A]/60 transition-colors duration-300"
                            />
                            <motion.button
                                type="submit"
                                disabled={loading}
                                data-testid="waitlist-submit-btn"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="acid-glow flex items-center justify-center gap-2 bg-[#CCFF00] text-[#08080A] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 clip-corner-sm disabled:opacity-60 transition-shadow duration-300"
                            >
                                <Zap size={16} strokeWidth={2.5} />
                                {loading ? "Locking..." : "Lock In"}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
