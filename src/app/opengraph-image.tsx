import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Boredfolio — India's Most Honest Mutual Fund Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1A1A1A",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: 12 }}>
          <span style={{ fontSize: 72, fontWeight: 900, color: "#F5F0E8" }}>bored</span>
          <span style={{ fontSize: 72, fontWeight: 400, color: "#F5F0E8" }}>folio</span>
          <span style={{ fontSize: 72, fontWeight: 400, color: "#6B8F71" }}>.</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#6B8F71",
            marginBottom: 40,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
          }}
        >
          India's Most Honest Mutual Fund Platform
        </div>
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#6B8F71",
            marginBottom: 40,
          }}
        />
        <div style={{ fontSize: 36, color: "#F5F0E8", lineHeight: 1.5, maxWidth: 900 }}>
          Your fund charges fees you can't see, buys stocks you can't name,
          and calls it "wealth creation."
        </div>
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 22, color: "#6B8F71" }}>
            We just tell you the truth.
          </div>
          <div style={{ fontSize: 18, color: "#666666" }}>
            boredfolio.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
