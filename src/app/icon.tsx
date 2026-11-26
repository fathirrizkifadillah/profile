import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          border: "1px solid #292929",
          borderRadius: "7px",
          color: "#C8A96B",
          fontSize: "19px",
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        V
      </div>
    ),
    {
      ...size,
    }
  );
}
