import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: claimsData } = await supabase.auth.getClaims()

  if (!claimsData?.claims) {
    redirect("/admin/login")
  }

  const { data: isAdmin, error } = await supabase.rpc("is_blog_admin")

  if (error || !isAdmin) {
    await supabase.auth.signOut()
    redirect("/admin/login?error=forbidden")
  }

  return claimsData.claims
}
