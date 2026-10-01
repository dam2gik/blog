"use server"

import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/shared/auth"
import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

export async function deletePostAction(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get("id"))
  if (!Number.isInteger(id) || id <= 0) return

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) throw new Error("글을 삭제하지 못했습니다.")

  revalidatePath("/")
  revalidatePath("/admin/posts")
}
