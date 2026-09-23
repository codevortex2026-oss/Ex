import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion";

const faqs = [
    {
        q: "What is EXHILARATION?",
        a: "A hard techno and trance event series based in Liverpool and the North West. Raw sound, heavy line-ups, no compromise — warehouse-grade production every single date.",
    },
    {
        q: "Where do the listings come from?",
        a: "Every date is listed through Skiddle — the UK's largest independent ticketing platform — so venues, times and lineups stay live and accurate.",
    },
    {
        q: "Which cities do you play?",
        a: "Liverpool is home turf. The series and its wider hard techno and trance circuit run across the North West — watch the events board for new rooms.",
    },
    {
        q: "How do I buy tickets?",
        a: "Every event routes you straight to the official Skiddle checkout. No resellers, no markups, no surprises at the door.",
    },
    {
        q: "Are the events 18+?",
        a: "Yes — strictly 18+ at every EXHILARATION event. Bring valid photo ID; there are no exceptions at the door.",
    },
];

export default function Faq() {
    return (
        <section id="faq" className="py-24 px-6 md:px-12 lg:px-20 bg-[#0C0C0F] border-t border-white/10" data-testid="faq-section">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-12"
                >
                    <p className="text-xs tracking-[0.3em] uppercase text-[#CCFF00] mb-4" data-testid="faq-eyebrow">
                        05 · Signal Check
                    </p>
                    <h2 className="font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl" data-testid="faq-heading">
                        Questions from the floor.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
                        {faqs.map((f, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="border-[#22222B]"
                                data-testid={`faq-item-${i}`}
                            >
                                <AccordionTrigger
                                    data-testid={`faq-trigger-${i}`}
                                    className="font-display font-semibold uppercase tracking-tight text-left text-base sm:text-lg hover:text-[#CCFF00] hover:no-underline transition-colors duration-300 py-6"
                                >
                                    {f.q}
                                </AccordionTrigger>
                                <AccordionContent
                                    className="text-sm text-[#8F909A] leading-relaxed"
                                    data-testid={`faq-content-${i}`}
                                >
                                    {f.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
