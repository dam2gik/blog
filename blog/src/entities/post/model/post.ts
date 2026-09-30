import type { JSONContent } from "@tiptap/react"

export type PostStatus = "draft" | "published"

export interface BlogCategory {
  id: number
  title: string
  slug: string
}

export interface BlogTag {
  id: number
  name: string
}

export interface BlogPostSummary {
  id: number
  title: string
  slug: string
  excerpt: string
  coverImageUrl: string | null
  status: PostStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  category: BlogCategory | null
  tags: BlogTag[]
}

export interface BlogPost extends BlogPostSummary {
  content: JSONContent
  contentText: string
  seoTitle: string | null
  seoDescription: string | null
}
