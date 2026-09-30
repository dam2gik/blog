import type { Metadata } from "next"

import { AdminCategoriesPage } from "@/_pages/admin-categories"

export const metadata: Metadata = {
  title: "카테고리 관리",
  robots: { index: false, follow: false },
}
export default AdminCategoriesPage
