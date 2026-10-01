"use server"

import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

export interface LoginState {
  error?: string
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력하세요." }
  }

  const supabase = await createSupabaseServerClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return { error: "로그인 정보를 확인하세요." }
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_blog_admin")

  if (adminError || !isAdmin) {
    await supabase.auth.signOut()
    return { error: "관리자 계정만 로그인할 수 있습니다." }
  }

  redirect("/admin")
}
