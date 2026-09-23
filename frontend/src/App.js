import { useEffect } from "react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Manifesto from "./components/Manifesto";
import Showcase from "./components/Showcase";
import Gallery from "./components/Gallery";
import Waitlist from "./components/Waitlist";
import Faq from "./components/Faq";
import Connect from "./components/Connect";
import Footer from "./components/Footer";

export default function App() {
    useEffect(() => {
        const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        let frame;
        const raf = (time) => {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(frame);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="relative bg-[#08080A] text-[#F4F4F6] min-h-screen" data-testid="landing-page">
            <div className="noise-overlay" aria-hidden="true" />
            <Header />
            <main>
                <Hero />
                <Marquee />
                <Manifesto />
                <Showcase />
                <Gallery />
                <Waitlist />
                <Faq />
                <Connect />
            </main>
            <Footer />
            <Toaster theme="dark" position="bottom-center" />
        </div>
    );
}
