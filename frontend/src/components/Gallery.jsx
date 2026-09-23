import { motion } from "framer-motion";

const images = [
    { url: "/gallery/ig5.jpg", alt: "On stage at Hangar 34 — DVOID × EXHILARATION closing set" },
    { url: "/gallery/ig6.jpg", alt: "Hands in the air under the rig" },
    { url: "/gallery/ig7.jpg", alt: "Behind the decks facing a packed floor" },
    { url: "/gallery/ig9.jpg", alt: "Headline set in front of a festival crowd" },
    { url: "/gallery/ig8.jpg", alt: "Tunnel session — EXHILARATION crew" },
];

export default function Gallery() {
    return (
        <section id="gallery" className="py-24 px-6 md:px-12 lg:px-20" data-testid="gallery-section">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
                >
                    <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4" data-testid="gallery-eyebrow">
                            Past Nights
                        </p>
                        <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl max-w-xl" data-testid="gallery-heading">
                            The floor, framed.
                        </h2>
                    </div>
                </motion.div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4" data-testid="gallery-grid">
                    {images.map((img, i) => (
                        <motion.figure
                            key={img.url}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                            className="group relative overflow-hidden clip-corner border border-[#22222B] hover:border-[#CCFF00]/50 transition-colors duration-500 mb-4 break-inside-avoid"
                            data-testid={`gallery-item-${i}`}
                        >
                            <img
                                src={img.url}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full h-auto contrast-110 group-hover:scale-[1.03] transition-transform duration-700"
                            />
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
