import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — Financial Markets & Quantitative Technology`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Curva decorativa fija (no representa datos de mercado).
const curve = "M0 300 L120 270 L220 285 L330 220 L430 240 L540 170 L640 190 L760 120 L860 140 L980 70 L1200 40";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#080D16",
          padding: "72px 80px",
          color: "#F1F5F9",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <svg width="1200" height="330" viewBox="0 0 1200 330" style={{ position: "absolute", left: 0, bottom: 0 }}>
          <path d={`${curve} L1200 330 L0 330 Z`} fill="#247BCE" fillOpacity="0.12" />
          <path d={curve} fill="none" stroke="#38BDF8" strokeWidth="3" />
        </svg>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#38BDF8", textTransform: "uppercase" }}>
          Financial Markets · Quantitative Finance · Technology
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>Entendiendo los mercados.</div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: "#94A3B8" }}>
            Construyendo tecnología.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#F1F5F9" }}>{site.name}</div>
      </div>
    ),
    size,
  );
}
