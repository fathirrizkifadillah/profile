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
          backgroundColor: "#EFF2F5",
          padding: "56px 64px",
          color: "#14191F",
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
                borderRadius: "10px",
                backgroundColor: "#14191F",
                color: "#FAFBFD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "20px",
              }}
            >
              V
            </div>
            <span style={{ fontSize: "24px", fontWeight: 600 }}>
              vedora.my.id
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              borderRadius: "999px",
              backgroundColor: "#FAFBFD",
              border: "1px solid #D4DCE4",
              fontSize: "18px",
              color: "#485461",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "#15803D",
              }}
            />
            <span>MAUNC IoT Lead, Universitas Siliwangi</span>
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
              color: "#485461",
              maxWidth: "860px",
              lineHeight: 1.4,
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
            borderTop: "1px solid #D4DCE4",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#525E6B",
          }}
        >
          <span>PyTorch / Flower FL / MediaPipe / Arduino / TypeScript</span>
          <span style={{ color: "#1B4FD8", fontWeight: 600 }}>
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
