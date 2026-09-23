import { motion } from "framer-motion";
import { Instagram, AudioLines, ArrowUpRight, Ticket } from "lucide-react";
import { SOCIALS, TICKETS_URL } from "../config";

const channels = [
    {
        icon: Instagram,
        label: "Instagram",
        handle: "@exhilaration.techno",
        href: SOCIALS.instagram,
        testid: "social-instagram-link",
    },
    {
        icon: AudioLines,
        label: "SoundCloud",
        handle: "exhilarationtechno",
        href: SOCIALS.soundcloud,
        testid: "social-soundcloud-link",
    },
    {
        icon: Ticket,
        label: "Skiddle",
        handle: "Follow the brand",
        href: TICKETS_URL,
        testid: "social-skiddle-link",
    },
];

export default function Connect() {
    return (
        <section id="connect" className="py-24 px-6 md:px-12 lg:px-20" data-testid="connect-section">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4" data-testid="connect-eyebrow">
                        Connect
                    </p>
                    <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl" data-testid="connect-heading">
                        Hear it before you queue for it.
                    </h2>
                    <p className="mt-4 text-sm text-[#8F909A] leading-relaxed max-w-md">
                        Sets, mixes and lineup announcements land on our channels first. Plug in and
                        stay on frequency.
                    </p>

                    <div className="mt-10 flex flex-col divide-y divide-[#22222B] border-y border-[#22222B]" data-testid="connect-channels">
                        {channels.map((c, i) => (
                            <motion.a
                                key={c.label}
                                href={c.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid={c.testid}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group flex items-center justify-between py-5 hover:bg-[#CCFF00]/[0.04] px-2 -mx-2 transition-colors duration-300"
                            >
                                <span className="flex items-center gap-4">
                                    <c.icon size={20} className="text-[#CCFF00]" strokeWidth={2} aria-hidden="true" />
                                    <span>
                                        <span className="block font-display font-semibold uppercase tracking-tight group-hover:text-[#CCFF00] transition-colors duration-300">
                                            {c.label}
                                        </span>
                                        <span className="block text-xs text-[#8F909A] mt-0.5">{c.handle}</span>
                                    </span>
                                </span>
                                <ArrowUpRight
                                    size={18}
                                    className="text-[#8F909A] group-hover:text-[#CCFF00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                                    aria-hidden="true"
                                />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="bg-[#111115] border border-[#22222B] clip-corner overflow-hidden"
                    data-testid="soundcloud-embed"
                >
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-[#22222B] bg-[#0C0C0F]">
                        <AudioLines size={14} className="text-[#CCFF00]" aria-hidden="true" />
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8F909A]">
                            soundcloud.com/exhilarationtechno
                        </span>
                    </div>
                    <iframe
                        title="EXHILARATION on SoundCloud"
                        data-testid="soundcloud-player"
                        width="100%"
                        height="450"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/exhilarationtechno&color=%23ccff00&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
                    />
                </motion.div>
            </div>
        </section>
    );
}
