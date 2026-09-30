import type { Metadata } from "next"

import { AdminEditorPage } from "@/_pages/admin-editor"

export const metadata: Metadata = {
  title: "새 글 작성",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AdminEditorPage />
}
