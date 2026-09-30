import type { JSONContent } from "@tiptap/react"

import { createSupabasePublicClient } from "@/shared/api/supabase/index.server"
import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

import type {
  BlogCategory,
  BlogPost,
  BlogPostSummary,
  BlogTag,
  PostStatus,
} from "../model/post"

const postSelect = `
  id,
  title,
  slug,
  excerpt,
  content,
  content_text,
  cover_image_url,
  status,
  seo_title,
  seo_description,
  published_at,
  created_at,
  updated_at,
  categories ( id, title, slug ),
  post_tags ( tags ( id, name ) )
`

type RawPost = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: JSONContent
  content_text: string
  cover_image_url: string | null
  status: PostStatus
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  categories: BlogCategory | null
  post_tags: Array<{ tags: BlogTag | null }>
}

function mapPost(post: RawPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    contentText: post.content_text,
    coverImageUrl: post.cover_image_url,
    status: post.status,
    seoTitle: post.seo_title,
    seoDescription: post.seo_description,
    publishedAt: post.published_at,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    category: post.categories,
    tags: post.post_tags.flatMap(({ tags }) => (tags ? [tags] : [])),
  }
}

export async function getPublishedPosts(category?: string) {
  const supabase = createSupabasePublicClient()
  let categoryId: number | undefined

  if (category) {
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .maybeSingle()
    categoryId = data?.id
    if (!categoryId) return []
  }

  let query = supabase
    .from("posts")
    .select(postSelect)
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Failed to load published posts", error.message)
    return []
  }

  return (data as unknown as RawPost[]).map(mapPost) satisfies BlogPostSummary[]
}

export async function getPublishedPost(slug: string) {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapPost(data as unknown as RawPost)
}

export async function getCategories() {
  const supabase = createSupabasePublicClient()
  const { data, error } = await supabase
    .from("categories")
    .select("id, title, slug")
    .order("title")

  if (error) {
    console.error("Failed to load categories", error.message)
    return []
  }

  return data as BlogCategory[]
}

export async function getAdminPosts() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error("글 목록을 불러오지 못했습니다.")
  }

  return (data as unknown as RawPost[]).map(mapPost)
}

export async function getAdminPost(id: number) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return mapPost(data as unknown as RawPost)
}
