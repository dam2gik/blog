import localFont from "next/font/local"

export const pretendard = localFont({
  src: [
    { path: "./PretendardVariable.woff2", weight: "45 920", style: "normal" },
  ],
  display: "swap",
  preload: true,
  fallback: [
    "Noto Sans KR",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "sans-serif",
  ],
  variable: "--font-pretendard",
})
