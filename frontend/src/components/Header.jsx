import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { TICKETS_URL, LOGO_URL } from "../config";

const links = [
    { label: "MANIFESTO", href: "#manifesto", testid: "nav-manifesto-link" },
    { label: "EVENTS", href: "#events", testid: "nav-events-link" },
    { label: "CONNECT", href: "#connect", testid: "nav-connect-link" },
    { label: "FAQ", href: "#faq", testid: "nav-faq-link" },
];

export default function Header() {
    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#08080A]/70 backdrop-blur-xl"
            data-testid="site-header"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-12 h-16">
                <a href="#top" data-testid="brand-logo" className="flex items-center gap-3">
                    <img
                        src={LOGO_URL}
                        alt="EXHILARATION logo"
                        className="h-9 w-9 object-cover clip-corner-sm border border-white/15"
                    />
                    <span className="hidden sm:inline font-display font-extrabold tracking-tighter text-lg uppercase">
                        Exhilaration<span className="text-[#CCFF00]">.</span>
                    </span>
                </a>

                <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.25em] text-[#8F909A] uppercase" data-testid="live-status">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]" />
                    </span>
                    Liverpool · North West
                </div>

                <nav className="hidden lg:flex items-center gap-8">
                    {links.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            data-testid={l.testid}
                            className="text-xs tracking-[0.2em] text-[#8F909A] hover:text-[#CCFF00] transition-colors duration-300"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <motion.a
                    href={TICKETS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="header-get-tickets-btn"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="acid-glow flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-display font-bold text-xs tracking-widest uppercase px-5 py-2.5 clip-corner-sm transition-shadow duration-300"
                >
                    <Ticket size={14} strokeWidth={2.5} />
                    Get Tickets
                </motion.a>
            </div>
        </motion.header>
    );
}
