import type { Metadata } from "next"

import { AdminEditorPage } from "@/_pages/admin-editor"

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "글 수정",
  robots: { index: false, follow: false },
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <AdminEditorPage postId={Number(id)} />
}
