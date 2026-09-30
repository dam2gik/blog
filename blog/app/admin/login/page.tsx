import type { Metadata } from "next"

import { AdminLoginPage } from "@/_pages/admin-login"

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false },
}

export default AdminLoginPage
