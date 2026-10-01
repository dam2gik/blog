export const siteConfig = {
  name: "kim2gic",
  description: "개발 관련 글을 기록하는 kim2gic 블로그입니다.",
  author: "kim2gic",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kim2gic.kr",
  locale: "ko_KR",
  links: {
    github: "https://github.com/dam2gik",
  },
} as const
