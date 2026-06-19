"use client";

import { useEffect, useRef, useState } from "react";

type GraphNode = {
  id: string;
  label: string; // short label shown inside the bubble
  title: string; // detail-panel heading
  summary: string; // detail-panel paragraph
  items?: string[]; // detail-panel chips
  kind?: "hub";
};

// ⚠️ Example content — replace the titles/summaries/items with your real details.
const NODES: GraphNode[] = [
  {
    id: "me",
    label: "Me",
    kind: "hub",
    title: "Jonathan Gong",
    summary:
      "A field guide to the people, places, and obsessions that shape what I build. Drag the bubbles around — and click any one to read more.",
  },
  {
    id: "school",
    label: "School",
    title: "Carnegie Mellon",
    summary:
      "Studying computer science with a steady pull toward design and human-computer interaction.",
    items: ["B.S. Computer Science", "HCI + systems", "Pittsburgh, PA"],
  },
  {
    id: "home",
    label: "Hometown",
    title: "Hometown",
    summary: "Where my baseline taste got set. Replace this with yours.",
    items: ["Grew up in ____", "____"],
  },
  {
    id: "family",
    label: "Family",
    title: "Family",
    summary: "The first people who taught me how to make things — and to finish them.",
    items: ["____", "____"],
  },
  {
    id: "friends",
    label: "Friends",
    title: "Friends",
    summary: "The group chat that keeps me honest and ships me memes at 2am.",
    items: ["____", "____"],
  },
  {
    id: "music",
    label: "Music",
    title: "Music",
    summary: "There's always something playing while I work. Replace with what you actually listen to.",
    items: ["____", "____"],
  },
  {
    id: "reading",
    label: "Reading",
    title: "Reading",
    summary: "Mostly nonfiction, design writing, and the occasional sci-fi binge.",
    items: ["____", "____"],
  },
  {
    id: "building",
    label: "Building",
    title: "Building",
    summary: "Side projects are how I learn. This site is one of them.",
    items: ["This portfolio", "____"],
  },
  {
    id: "outdoors",
    label: "Outdoors",
    title: "Outdoors",
    summary: "Off the screen whenever I can be — replace with your real outlet.",
    items: ["____", "____"],
  },
];

type Body = { x: number; y: number; vx: number; vy: number; r: number };

export default function MindGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(HTMLButtonElement | null)[]>([]);
  const lineEls = useRef<(SVGLineElement | null)[]>([]);
  const sim = useRef<Body[]>([]);
  const drag = useRef<{ i: number; startX: number; startY: number; moved: boolean } | null>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const ignoreClick = useRef(false);

  const [selected, setSelected] = useState("me");
  const [ready, setReady] = useState(false);

  const hubIndex = NODES.findIndex((n) => n.kind === "hub");
  const radiusFor = (n: GraphNode) => (n.kind === "hub" ? 64 : 52);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = container.clientWidth;
    let H = container.clientHeight;

    const place = () => {
      sim.current = NODES.map((n, i) => {
        const angle = (i / NODES.length) * Math.PI * 2;
        const ring = Math.min(W, H) * 0.32;
        return {
          x: W / 2 + Math.cos(angle) * ring,
          y: H / 2 + Math.sin(angle) * ring,
          vx: 0,
          vy: 0,
          r: radiusFor(NODES[i]),
        };
      });
      sim.current[hubIndex].x = W / 2;
      sim.current[hubIndex].y = H / 2;
    };

    const writeFrame = () => {
      const hub = sim.current[hubIndex];
      for (let i = 0; i < NODES.length; i++) {
        const p = sim.current[i];
        const el = nodeEls.current[i];
        if (el)
          el.style.transform = `translate(${(p.x - p.r).toFixed(1)}px, ${(
            p.y - p.r
          ).toFixed(1)}px)`;
        const line = lineEls.current[i];
        if (line) {
          line.setAttribute("x1", String(hub.x));
          line.setAttribute("y1", String(hub.y));
          line.setAttribute("x2", String(p.x));
          line.setAttribute("y2", String(p.y));
        }
      }
    };

    place();
    writeFrame();
    setReady(true);

    const onResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      if (reduce) {
        place();
        writeFrame();
      }
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      // Static ring layout, no physics.
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    const step = () => {
      const L = Math.min(W, H) * 0.34;
      const hub = sim.current[hubIndex];
      hub.x = W / 2;
      hub.y = H / 2;

      for (let i = 0; i < NODES.length; i++) {
        if (i === hubIndex) continue;
        const p = sim.current[i];
        if (drag.current?.i === i) continue;

        let fx = 0;
        let fy = 0;

        // spring toward the hub at distance L
        const dx = p.x - hub.x;
        const dy = p.y - hub.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        fx += -(dx / dist) * (dist - L) * 0.012;
        fy += -(dy / dist) * (dist - L) * 0.012;

        // node-to-node collision + mild charge
        for (let j = 0; j < NODES.length; j++) {
          if (j === i) continue;
          const q = sim.current[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d = Math.hypot(ddx, ddy) || 0.001;
          const minD = p.r + q.r + 14;
          if (d < minD) {
            const push = (minD - d) * 0.5;
            fx += (ddx / d) * push * 0.14;
            fy += (ddy / d) * push * 0.14;
          } else {
            const charge = 420 / (d * d);
            fx += (ddx / d) * charge;
            fy += (ddy / d) * charge;
          }
        }

        // mouse repulsion — very light, and skipped on the bubble being
        // hovered so it holds still and stays easy to click.
        if (pointer.current.active) {
          const mdx = p.x - pointer.current.x;
          const mdy = p.y - pointer.current.y;
          const md = Math.hypot(mdx, mdy) || 0.001;
          const R = 100;
          if (md > p.r && md < R) {
            const force = (1 - md / R) * 1.1;
            fx += (mdx / md) * force;
            fy += (mdy / md) * force;
          }
        }

        p.vx = (p.vx + fx) * 0.86;
        p.vy = (p.vy + fy) * 0.86;
        p.x += p.vx;
        p.y += p.vy;

        // walls
        if (p.x < p.r) {
          p.x = p.r;
          p.vx *= -0.4;
        } else if (p.x > W - p.r) {
          p.x = W - p.r;
          p.vx *= -0.4;
        }
        if (p.y < p.r) {
          p.y = p.r;
          p.vy *= -0.4;
        } else if (p.y > H - p.r) {
          p.y = H - p.r;
          p.vy *= -0.4;
        }
      }

      writeFrame();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    pointer.current.x = e.clientX - rect.left;
    pointer.current.y = e.clientY - rect.top;
    pointer.current.active = true;
    if (drag.current) {
      const p = sim.current[drag.current.i];
      p.x = pointer.current.x;
      p.y = pointer.current.y;
      p.vx = 0;
      p.vy = 0;
      if (
        Math.hypot(
          pointer.current.x - drag.current.startX,
          pointer.current.y - drag.current.startY,
        ) > 5
      ) {
        drag.current.moved = true;
      }
    }
  };

  const startDrag = (i: number) => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const rect = containerRef.current!.getBoundingClientRect();
    drag.current = {
      i,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      moved: false,
    };
  };
  const endDrag = () => {
    ignoreClick.current = drag.current?.moved ?? false;
    drag.current = null;
  };
  const onClickNode = (id: string) => () => {
    if (ignoreClick.current) {
      ignoreClick.current = false;
      return;
    }
    setSelected(id);
  };

  const selectedNode = NODES.find((n) => n.id === selected)!;

  return (
    <div>
      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={() => (pointer.current.active = false)}
        className="relative h-[440px] w-full touch-none overflow-hidden border-2 border-foreground bg-surface md:h-[560px]"
      >
        {/* edges */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {NODES.map((n, i) =>
            n.kind === "hub" ? null : (
              <line
                key={n.id}
                ref={(el) => {
                  lineEls.current[i] = el;
                }}
                stroke="var(--color-foreground)"
                strokeWidth={1.5}
                opacity={0.35}
              />
            ),
          )}
        </svg>

        {/* nodes */}
        {NODES.map((n, i) => {
          const isHub = n.kind === "hub";
          const isSel = n.id === selected;
          const size = radiusFor(n) * 2;
          return (
            <button
              key={n.id}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              onPointerDown={startDrag(i)}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClick={onClickNode(n.id)}
              aria-label={`${n.label}${isSel ? " — selected" : ""}`}
              aria-pressed={isSel}
              style={{ width: size, height: size, opacity: ready ? 1 : 0 }}
              className={`absolute left-0 top-0 flex cursor-grab touch-none items-center justify-center rounded-full border-2 border-foreground p-2 text-center font-mono text-xs font-bold uppercase leading-tight tracking-wider transition-[background-color,color,opacity] duration-150 will-change-transform select-none active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isSel
                  ? "bg-foreground text-background"
                  : isHub
                    ? "bg-accent text-accent-foreground"
                    : "bg-background text-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      {/* detail panel */}
      <div className="mt-6 border-2 border-foreground bg-surface">
        <div className="flex items-center justify-between border-b-2 border-foreground bg-foreground px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-background">
          <span>{selectedNode.label}</span>
          <span>{selected === "me" ? "Start here" : "Detail"}</span>
        </div>
        <div className="p-6">
          <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
            {selectedNode.title}
          </h3>
          <p className="mt-3 max-w-content text-base leading-relaxed text-muted">
            {selectedNode.summary}
          </p>
          {selectedNode.items && selectedNode.items.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {selectedNode.items.map((item, idx) => (
                <li
                  key={idx}
                  className="border border-foreground px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-wider text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
