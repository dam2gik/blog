"use server"

import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

export async function logoutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/")
}
