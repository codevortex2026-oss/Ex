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
        a: "EXHILARATION throws hard techno and trance raves across Liverpool and the North West — raw sound, heavy line-ups and no compromise, with warehouse-grade production at every date.",
    },
    {
        q: "Where do your event listings come from?",
        a: "Every date is listed through Skiddle — the UK's largest independent ticketing platform — so venues, times and line-ups stay live and accurate.",
    },
    {
        q: "Which cities do you host events in?",
        a: "Liverpool is our home — every EXHILARATION rave happens here. As we grow across the North West, new cities will appear on the events board first.",
    },
    {
        q: "How do I buy tickets?",
        a: "Every event routes you straight to the official Skiddle checkout. No resellers, no markups, no surprises at the door.",
    },
    {
        q: "Are your events 18+?",
        a: "Yes — every EXHILARATION event is strictly 18+. Bring valid photo ID, as there are no exceptions at the door.",
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
