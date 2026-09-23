import { motion } from "framer-motion";
import { Disc3, Warehouse, Ticket } from "lucide-react";

const chapters = [
    {
        num: "01",
        icon: Disc3,
        title: "Headline Line-ups",
        copy: "From international headliners like Ragetrain to the North West's hardest local selectors — every bill is stacked, every set built for the floor.",
        img: "https://images.pexels.com/photos/16553609/pexels-photo-16553609.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        alt: "DJ performing in near darkness",
        testid: "chapter-lineups",
    },
    {
        num: "02",
        icon: Warehouse,
        title: "Warehouse Rooms",
        copy: "From the O2 Academy to low-ceilinged sweatboxes across Liverpool — big systems, dark rooms, zero frills.",
        img: "https://images.unsplash.com/photo-1558620013-a08999547a36?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHxfHx0ZWNobm8lMjByYXZlJTIwY3Jvd2QlMjBsYXNlcnMlMjBkYXJrJTIwd2FyZWhvdXNlJTIwcGFydHklMjBkaiUyMGRyb3AlMjBzb3VuZCUyMGxpZ2h0JTIwc3RhZ2V8ZW58MHx8fHwxNzkwMTg5ODU4fDA&ixlib=rb-4.1.0&q=85",
        alt: "Warehouse stage lit by strobes",
        testid: "chapter-rooms",
    },
    {
        num: "03",
        icon: Ticket,
        title: "Direct Ticket Access",
        copy: "One tap from lineup to checkout. Tickets route straight through Skiddle — 8,643 ravers already trust the signal. Sell-outs stop being surprises.",
        img: "https://images.pexels.com/photos/5610109/pexels-photo-5610109.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        alt: "Crowd with hands raised in strobe light",
        testid: "chapter-tickets",
    },
];

export default function Manifesto() {
    return (
        <section id="manifesto" className="py-24 px-6 md:px-12 lg:px-20" data-testid="manifesto-section">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-16"
                >
                    <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4" data-testid="manifesto-eyebrow">
                        The Manifesto
                    </p>
                    <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl max-w-2xl" data-testid="manifesto-heading">
                        Built by ravers. Tuned for the floor.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {chapters.map((c, i) => (
                        <motion.article
                            key={c.num}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.7, delay: i * 0.12 }}
                            whileHover={{ y: -6 }}
                            className="group bg-[#111115] border border-[#22222B] hover:border-[#CCFF00]/40 transition-colors duration-500 clip-corner flex flex-col"
                            data-testid={c.testid}
                        >
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={c.img}
                                    alt={c.alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover grayscale-[0.5] contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-[transform,filter] duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111115] to-transparent" />
                            </div>
                            <div className="p-6 flex flex-col gap-3 grow">
                                <c.icon size={20} className="text-[#CCFF00]" strokeWidth={2} aria-hidden="true" />
                                <h3 className="font-display font-semibold uppercase text-xl tracking-tight">{c.title}</h3>
                                <p className="text-sm text-[#8F909A] leading-relaxed">{c.copy}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
