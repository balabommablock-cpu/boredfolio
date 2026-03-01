import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Boredfolio — India's Most Honest Mutual Fund Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#F5F0E8",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#1A1A1A",
              letterSpacing: "-2px",
            }}
          >
            boredfolio<span style={{ color: "#6B8F71" }}>.</span>
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#666666",
              maxWidth: "600px",
              textAlign: "center",
              lineHeight: "1.4",
            }}
          >
            India's most honest mutual fund platform.
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "16px",
              color: "#6B8F71",
              letterSpacing: "4px",
              textTransform: "uppercase" as const,
            }}
          >
            boring you into wealth
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
