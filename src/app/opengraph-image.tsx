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
          backgroundColor: "#F3EFE7",
          padding: "56px 64px",
          color: "#1A1917",
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
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#1A1917",
                color: "#FBF9F5",
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "18px",
              color: "#57524B",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "#2F7D4F",
              }}
            />
            <span>MAUNC IoT Lead · Universitas Siliwangi</span>
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
              color: "#57524B",
              maxWidth: "860px",
              lineHeight: 1.45,
            }}
          >
            Generative AI, Machine Learning, On-Device Computer Vision, and IoT
            prototyping. Oracle Certified Generative AI Professional.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(26, 25, 23, 0.14)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#57524B",
          }}
        >
          <span>PyTorch / Flower FL / MediaPipe / Arduino / TypeScript</span>
          <span style={{ color: "#B84A27", fontWeight: 600 }}>
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
