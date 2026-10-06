import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "배드민턴 룰 교실",
    short_name: "룰 교실",
    description: "초심자를 위한 배드민턴 복식 경기 규칙 튜토리얼",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#f97316",
    lang: "ko",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
