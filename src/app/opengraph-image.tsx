import { ImageResponse } from "next/og";

export const alt = "배드민턴 룰 교실 - 복식 서브 위치 완벽 정리";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "배드민턴 룰 교실";
const SUBTITLE = "복식 경기, 헷갈리는 위치 선정 완벽 정리!";
const BADGES = ["튜토리얼", "점수 시뮬레이터", "퀴즈"];

// The default OG font has no Hangul glyphs, so load a subset of Noto Sans KR
// containing just the characters we render.
async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const text = encodeURIComponent([TITLE, SUBTITLE, ...BADGES].join(""));
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${text}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await loadKoreanFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
          fontFamily: font ? "NotoSansKR" : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 560,
            height: 250,
            background: "#2d8a4e",
            border: "8px solid white",
            borderRadius: 16,
            position: "relative",
            marginBottom: 40,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ position: "absolute", left: 272, top: -12, width: 8, height: 266, background: "white" }} />
          <div style={{ position: "absolute", left: 0, top: 117, width: 180, height: 4, background: "white" }} />
          <div style={{ position: "absolute", right: 0, top: 117, width: 180, height: 4, background: "white" }} />
          {[
            { left: 80, top: 160, color: "#f97316" },
            { left: 80, top: 40, color: "#f97316" },
            { left: 420, top: 40, color: "#3b82f6" },
            { left: 420, top: 160, color: "#3b82f6" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: p.left,
                top: p.top,
                width: 48,
                height: 48,
                borderRadius: 24,
                background: "white",
                border: `6px solid ${p.color}`,
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, color: "#1f2937", display: "flex" }}>{font ? TITLE : "Badminton Rules"}</div>
        <div style={{ fontSize: 34, color: "#6b7280", marginTop: 12, display: "flex" }}>
          {font ? SUBTITLE : "Doubles serving positions, explained"}
        </div>
        {font && (
          <div style={{ display: "flex", gap: 16, marginTop: 28 }}>
            {BADGES.map((badge) => (
              <div
                key={badge}
                style={{ background: "#f97316", color: "white", fontSize: 26, padding: "8px 22px", borderRadius: 999 }}
              >
                {badge}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "NotoSansKR", data: font, weight: 800, style: "normal" }] : undefined,
    }
  );
}
