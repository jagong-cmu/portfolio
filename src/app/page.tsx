import Button from "@/components/Button";
import SystemBar from "@/components/SystemBar";
import ParallaxProvider from "@/components/parallax/ParallaxProvider";
import MouseParallax from "@/components/parallax/MouseParallax";
import Marquee from "@/components/parallax/Marquee";

const ticker = [
  "Software Engineer",
  "Designer",
  "Carnegie Mellon",
  "TypeScript",
  "React",
  "Next.js",
  "Open to work",
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-wide flex-1 flex-col px-6 md:px-10">
      <SystemBar left="Portfolio — 2026" right="Carnegie Mellon" />

      {/* Hero — mouse parallax layers (grid lives globally in the layout) */}
      <ParallaxProvider className="relative flex flex-1 flex-col justify-center py-section">
        <MouseParallax factor={8}>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Software Engineer · Designer
          </p>
        </MouseParallax>

        <MouseParallax factor={16}>
          <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.85] tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
            Jonathan
            <br />
            <span className="text-outline">Gong</span>
          </h1>
        </MouseParallax>

        <p className="mt-10 max-w-content text-xl leading-snug text-muted md:text-2xl">
          I build careful software — the kind where the details are the point,
          not a polish pass at the end.
        </p>

        <div className="mt-12">
          <Button href="/projects">View work</Button>
        </div>
      </ParallaxProvider>

      {/* Ticker — full-bleed marquee */}
      <div className="-mx-6 border-y-2 border-foreground py-3 md:-mx-10">
        <Marquee items={ticker} durationSec={28} />
      </div>
    </main>
  );
}
