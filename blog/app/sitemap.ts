import type { MetadataRoute } from "next"

import { getPublishedPosts } from "@/entities/post/index.server"
import { siteConfig } from "@/shared/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts()

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/posts/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}

export const dynamic = "force-dynamic"
