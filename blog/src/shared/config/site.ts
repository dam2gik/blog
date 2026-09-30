export const siteConfig = {
  name: "상훈의 기록",
  description:
    "개발과 일상에서 발견한 것을 차분하게 기록하는 개인 블로그입니다.",
  author: "김상훈",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "ko_KR",
  links: {
    github: "https://github.com/dam2gik",
  },
} as const
