import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Instagram, AudioLines } from "lucide-react";
import { TICKETS_URL, SOCIALS } from "../config";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/10" data-testid="site-footer">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16">
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4">
                            Raw sound. Heavy line-ups. No compromise.
                        </p>
                        <motion.a
                            href={TICKETS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid="footer-get-tickets-btn"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="acid-glow inline-flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 clip-corner-sm transition-shadow duration-300"
                        >
                            Get Tickets
                            <ArrowUpRight size={18} strokeWidth={2.5} />
                        </motion.a>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-5">
                        <div className="flex items-center gap-3" data-testid="footer-socials">
                            <a
                                href={SOCIALS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="footer-instagram-link"
                                aria-label="EXHILARATION on Instagram"
                                className="acid-glow flex items-center justify-center h-11 w-11 border border-white/20 text-[#F4F4F6] hover:text-[#CCFF00] hover:border-[#CCFF00]/60 clip-corner-sm transition-colors duration-300"
                            >
                                <Instagram size={18} strokeWidth={2} />
                            </a>
                            <a
                                href={SOCIALS.soundcloud}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="footer-soundcloud-link"
                                aria-label="EXHILARATION on SoundCloud"
                                className="acid-glow flex items-center justify-center h-11 w-11 border border-white/20 text-[#F4F4F6] hover:text-[#CCFF00] hover:border-[#CCFF00]/60 clip-corner-sm transition-colors duration-300"
                            >
                                <AudioLines size={18} strokeWidth={2} />
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#8F909A]" data-testid="footer-location">
                            <MapPin size={14} className="text-[#FF2B56]" aria-hidden="true" />
                            Liverpool · North West · UK
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] tracking-[0.25em] uppercase text-[#8F909A]">
                    <span data-testid="footer-copyright">© 2026 Exhilaration Techno</span>
                    <span>Powered by the underground</span>
                </div>
            </div>

            <div
                className="pointer-events-none select-none font-display font-extrabold uppercase tracking-tighter leading-none text-[18vw] text-stroke text-center -mb-[4vw]"
                aria-hidden="true"
                data-testid="footer-watermark"
            >
                Exhilaration
            </div>
        </footer>
    );
}
