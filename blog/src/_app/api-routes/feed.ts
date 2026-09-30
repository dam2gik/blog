import { getPublishedPosts } from "@/entities/post/index.server"
import { siteConfig } from "@/shared/config"

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export async function getRssFeed() {
  const posts = await getPublishedPosts()
  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/posts/${post.slug}`
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid>${url}</guid><description>${escapeXml(post.excerpt)}</description><pubDate>${new Date(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate></item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(siteConfig.name)}</title><link>${siteConfig.url}</link><description>${escapeXml(siteConfig.description)}</description><language>ko</language>${items}</channel></rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  })
}
