import type { Metadata } from "next"

import { AdminDashboardPage } from "@/_pages/admin-dashboard"

export const metadata: Metadata = {
  title: "관리자 대시보드",
  robots: { index: false, follow: false },
}

export default AdminDashboardPage
