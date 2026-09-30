import type { Metadata } from "next"

import { AdminPostsPage } from "@/_pages/admin-posts"

export const metadata: Metadata = {
  title: "글 관리",
  robots: { index: false, follow: false },
}
export default AdminPostsPage
