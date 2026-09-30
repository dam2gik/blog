"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import { requireAdmin } from "@/shared/auth"
import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

export interface SavePostState {
  error?: string
}

const savePostSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(1, "제목을 입력하세요.").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "주소를 입력하세요.")
    .regex(/^[a-z0-9가-힣]+(?:-[a-z0-9가-힣]+)*$/, "주소 형식을 확인하세요."),
  excerpt: z.string().trim().max(300),
  content: z.string().min(1),
  contentText: z.string(),
  categoryId: z.string().transform((value, context) => {
    if (!value || value === "none") return null
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) {
      context.addIssue({ code: "custom", message: "카테고리를 확인하세요." })
      return z.NEVER
    }
    return id
  }),
  status: z.enum(["draft", "published"]),
  coverImageUrl: z.string().url().or(z.literal("")),
  seoTitle: z.string().trim().max(60),
  seoDescription: z.string().trim().max(160),
  tags: z.string(),
})

export async function savePostAction(
  _previousState: SavePostState,
  formData: FormData
): Promise<SavePostState> {
  await requireAdmin()

  const result = savePostSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "입력값을 확인하세요." }
  }

  let content: unknown
  try {
    content = JSON.parse(result.data.content)
  } catch {
    return { error: "본문 형식이 올바르지 않습니다." }
  }

  const supabase = await createSupabaseServerClient()
  const tags = result.data.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10)

  const { error } = await supabase.rpc("save_blog_post", {
    p_post_id: result.data.id ?? null,
    p_title: result.data.title,
    p_slug: result.data.slug,
    p_excerpt: result.data.excerpt,
    p_content: content,
    p_content_text: result.data.contentText,
    p_category_id: result.data.categoryId,
    p_status: result.data.status,
    p_cover_image_url: result.data.coverImageUrl,
    p_seo_title: result.data.seoTitle,
    p_seo_description: result.data.seoDescription,
    p_tags: tags,
  })

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 사용 중인 글 주소입니다." }
    }
    return { error: "글을 저장하지 못했습니다. 잠시 후 다시 시도하세요." }
  }

  revalidatePath("/")
  revalidatePath("/sitemap.xml")
  revalidatePath("/feed.xml")
  redirect("/admin/posts?saved=1")
}
