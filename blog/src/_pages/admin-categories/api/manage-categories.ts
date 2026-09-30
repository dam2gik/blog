"use server"

import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/shared/auth"
import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"
import { slugify } from "@/shared/lib"

export interface CategoryState {
  error?: string
  success?: boolean
}

export async function createCategoryAction(
  _previousState: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  await requireAdmin()
  const title = String(formData.get("title") ?? "").trim()
  const slug = slugify(String(formData.get("slug") ?? "") || title)

  if (!title || title.length > 40 || !slug) {
    return { error: "카테고리 이름과 주소를 확인하세요." }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("categories").insert({ title, slug })

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "이미 존재하는 카테고리입니다."
          : "카테고리를 추가하지 못했습니다.",
    }
  }

  revalidatePath("/")
  revalidatePath("/admin/categories")
  return { success: true }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  if (!Number.isInteger(id) || id <= 0) return

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) throw new Error("카테고리를 삭제하지 못했습니다.")

  revalidatePath("/")
  revalidatePath("/admin/categories")
}
