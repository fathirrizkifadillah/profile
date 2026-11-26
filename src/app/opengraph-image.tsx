import { ImageResponse } from "next/og";

export const alt = "Fathir Rizki Fadillah (Vedora) — AI Engineer & IoT Systems";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#050505",
          padding: "56px 64px",
          color: "#F5F5F5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                backgroundColor: "#111111",
                border: "1px solid #292929",
                color: "#C8A96B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              V
            </div>
            <span style={{ fontSize: "22px", fontWeight: 600 }}>
              vedora.my.id
            </span>
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#C8A96B",
              fontWeight: 600,
            }}
          >
            Lead — MAUNC IoT Community
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              maxWidth: "960px",
            }}
          >
            Fathir Rizki Fadillah builds AI systems that reach physical hardware.
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#999999",
              maxWidth: "860px",
              lineHeight: 1.45,
            }}
          >
            Generative AI, Machine Learning, On-Device Computer Vision, and IoT
            hardware prototyping. Lead at MAUNC IoT Community.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #292929",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#999999",
          }}
        >
          <span>PyTorch / Flower FL / MediaPipe / Arduino / TypeScript</span>
          <span style={{ color: "#C8A96B", fontWeight: 600 }}>
            fathirrf80@gmail.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
