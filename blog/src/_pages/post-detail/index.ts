import type { Metadata } from "next"

import { getPublishedPost } from "@/entities/post/index.server"
import { siteConfig } from "@/shared/config"

export { PostDetailPage } from "./ui/post-detail-page"

export async function generatePostMetadata(slug: string): Promise<Metadata> {
  const post = await getPublishedPost(slug)

  if (!post) {
    return { title: "글을 찾을 수 없습니다" }
  }

  const title = post.seoTitle ?? post.title
  const description = post.seoDescription ?? post.excerpt
  const url = `/posts/${post.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      title,
      description,
      url,
      publishedTime: post.publishedAt ?? post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags.map((tag) => tag.name),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  }
}
