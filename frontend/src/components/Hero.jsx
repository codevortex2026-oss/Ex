import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Bell } from "lucide-react";
import { TICKETS_URL, LOGO_URL } from "../config";

const HERO_BG =
    "https://images.unsplash.com/photo-1574155376612-bfa4ed8aabfd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwyfHx0ZWNobm8lMjByYXZlJTIwY3Jvd2QlMjBsYXNlcnMlMjBkYXJrJTIwd2FyZWhvdXNlJTIwcGFydHklMjBkaiUyMGRyb3AlMjBzb3VuZCUyMGxpZ2h0JTIwc3RhZ2V8ZW58MHx8fHwxNzkwMTg5ODU4fDA&ixlib=rb-4.1.0&q=85";

const MaskedLine = ({ children, delay }) => (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
        <motion.span
            className="block sm:whitespace-nowrap"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.span>
    </span>
);

const Soundwave = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf;
        let t = 0;

        const draw = () => {
            const { width, height } = canvas.getBoundingClientRect();
            if (canvas.width !== width * 2) {
                canvas.width = width * 2;
                canvas.height = height * 2;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const bars = 96;
            const bw = canvas.width / bars;
            for (let i = 0; i < bars; i++) {
                const p = i / bars;
                const amp =
                    Math.abs(Math.sin(p * 9 + t * 1.6)) *
                    Math.abs(Math.sin(p * 23 - t * 0.9)) *
                    (0.35 + 0.65 * Math.abs(Math.sin(t * 0.5 + p * 3)));
                const h = amp * canvas.height * 0.9;
                ctx.fillStyle = i % 9 === 0 ? "rgba(255,43,86,0.75)" : "rgba(204,255,0,0.55)";
                ctx.fillRect(i * bw + bw * 0.25, (canvas.height - h) / 2, bw * 0.5, h);
            }
            t += 0.016;
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-16 opacity-70" data-testid="hero-soundwave" aria-hidden="true" />;
};

const stats = [
    { value: "8,643", label: "Followers", testid: "stat-followers" },
    { value: "1,191", label: "Skiddle Reviews", testid: "stat-reviews" },
    { value: "4.5★", label: "Community Rating", testid: "stat-rating" },
];

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
    const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    return (
        <section ref={ref} id="top" className="relative min-h-screen flex flex-col justify-end overflow-hidden scanlines" data-testid="hero-section">
            <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10">
                <img
                    src={HERO_BG}
                    alt="Warehouse rave crowd under lasers"
                    className="w-full h-full object-cover scale-110 grayscale-[0.35] contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/55 to-[#08080A]/20" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,8,10,0.55)_100%)]" />
            </motion.div>

            <motion.div style={{ opacity: fade }} className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-32 pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="inline-flex items-center gap-2 border border-[#CCFF00]/40 bg-[#CCFF00]/5 px-3 py-1.5 mb-8"
                    data-testid="hero-badge"
                >
                    <span className="h-1.5 w-1.5 bg-[#CCFF00] rounded-full" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#CCFF00]">
                        Hard Techno · Trance · Liverpool
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                >
                    <img
                        src={LOGO_URL}
                        alt="EXHILARATION — hard techno and trance event series"
                        data-testid="hero-logo"
                        className="h-28 w-28 sm:h-36 sm:w-36 object-cover clip-corner border border-[#CCFF00]/40 shadow-[0_0_60px_rgba(204,255,0,0.15)]"
                    />
                </motion.div>

                <h1 className="font-display font-extrabold uppercase tracking-tighter leading-[0.92] text-[7vw] sm:text-5xl lg:text-7xl origin-left scale-x-95 sm:scale-x-100" data-testid="hero-headline">
                    <MaskedLine delay={0.45}>Raw Sound.</MaskedLine>
                    <MaskedLine delay={0.58}>Heavy Line-ups.</MaskedLine>
                    <MaskedLine delay={0.71}>
                        <span className="text-[#CCFF00]">No Compromise.</span>
                    </MaskedLine>
                </h1>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="mt-8 max-w-xl text-sm sm:text-base text-[#8F909A] leading-relaxed"
                    data-testid="hero-subcopy"
                >
                    EXHILARATION is Liverpool's hard techno and trance event series.
                    Raw sound, heavy line-ups, no compromise — every date, every
                    warehouse, straight from the source.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.15 }}
                    className="mt-10 flex flex-wrap items-center gap-4"
                >
                    <motion.a
                        href="#events"
                        data-testid="hero-see-events-btn"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="acid-glow flex items-center gap-2 bg-[#CCFF00] text-[#08080A] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 clip-corner-sm transition-shadow duration-300"
                    >
                        See the Line-ups
                        <ArrowUpRight size={18} strokeWidth={2.5} />
                    </motion.a>
                    <motion.a
                        href="#notify"
                        data-testid="hero-notify-btn"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 border border-white/20 hover:border-[#CCFF00]/60 text-[#F4F4F6] font-display font-bold text-sm tracking-widest uppercase px-8 py-4 clip-corner-sm transition-colors duration-300"
                    >
                        <Bell size={16} strokeWidth={2.5} />
                        Get Notified
                    </motion.a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.35 }}
                    className="mt-14 grid grid-cols-3 max-w-lg divide-x divide-white/10 border-y border-white/10"
                    data-testid="hero-stats"
                >
                    {stats.map((s) => (
                        <div key={s.label} className="px-4 py-4 first:pl-0" data-testid={s.testid}>
                            <div className="font-display font-bold text-xl sm:text-2xl text-[#F4F4F6]">{s.value}</div>
                            <div className="text-[10px] tracking-[0.2em] uppercase text-[#8F909A] mt-1">{s.label}</div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.5 }}
                    className="mt-10"
                >
                    <Soundwave />
                </motion.div>
            </motion.div>
        </section>
    );
}
