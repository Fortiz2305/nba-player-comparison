import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aday Mara - Comparación NCAA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const comparables = [
  { name: "Karl-Anthony Towns", pct: "93.7%", pick: "#1" },
  { name: "Al Horford", pct: "93.0%", pick: "#3" },
  { name: "Roy Hibbert", pct: "93.1%", pick: "#17" },
  { name: "Robert Williams", pct: "92.7%", pick: "#27" },
];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(255,203,5,0.15)",
                color: "#FFCB05",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              MICHIGAN · BIG TEN · 2.21m · DRAFT 2026
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            ¿A quién se parecerá
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: 800,
              color: "#FFCB05",
              lineHeight: 1.1,
              marginBottom: "40px",
            }}
          >
            Aday Mara en la NBA?
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {comparables.map((p) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  padding: "20px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#FFCB05",
                    marginBottom: "4px",
                  }}
                >
                  {p.pct}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "white",
                    marginBottom: "4px",
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Draft pick {p.pick}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "14px",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Predicción draft:
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                fontWeight: 800,
                color: "#FFCB05",
              }}
            >
              Pick #24
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            datosconnba.netlify.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
