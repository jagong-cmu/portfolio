import { ImageResponse } from "next/og";

// Route segment config — applies this OG image to all routes that don't
// define their own. 1200×630 is the canonical OpenGraph card size.
export const alt = "Jonathan Gong — Software Engineer & Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette pulled from globals.css (dark "ink" surface).
const INK = "#0d1b2a";
const ALABASTER = "#e0e1dd";
const ACCENT = "#819bb9";
const SUBTLE = "#778da9";
const BORDER = "#273647";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: INK,
          color: ALABASTER,
          padding: "64px 72px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Document-header strip — mirrors the on-site dossier motif */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 24,
            borderBottom: `2px solid ${BORDER}`,
            color: SUBTLE,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span>Portfolio — 2026</span>
          <span>Carnegie Mellon</span>
        </div>

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              color: ACCENT,
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Software Engineer · Designer
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 132,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Jonathan Gong
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 36,
              lineHeight: 1.35,
              color: "#abbcd1",
              maxWidth: 880,
            }}
          >
            I build careful software — the kind where the details are the point.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
