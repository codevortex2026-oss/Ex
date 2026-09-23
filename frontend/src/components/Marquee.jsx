const items = [
    "HARD TECHNO",
    "TRANCE",
    "LIVERPOOL",
    "O2 ACADEMY",
    "RAGETRAIN · 03 OCT",
    "NORTH WEST",
    "ALL NIGHT LONG",
    "RAW SOUND",
    "HEAVY LINE-UPS",
    "NO COMPROMISE",
];

export default function Marquee() {
    const row = [...items, ...items];
    return (
        <div className="relative border-y border-white/10 bg-[#0C0C0F] py-5 overflow-hidden" data-testid="live-marquee">
            <div className="marquee-track items-center gap-10 pr-10">
                {row.map((item, i) => (
                    <span key={i} className="flex items-center gap-10 shrink-0">
                        <span
                            className={`font-display font-bold uppercase tracking-tight text-2xl sm:text-3xl whitespace-nowrap ${
                                i % 4 === 2 ? "text-stroke" : i % 4 === 1 ? "text-[#CCFF00]" : "text-[#F4F4F6]"
                            }`}
                        >
                            {item}
                        </span>
                        <span className="h-2 w-2 rotate-45 bg-[#FF2B56] shrink-0" aria-hidden="true" />
                    </span>
                ))}
            </div>
        </div>
    );
}
