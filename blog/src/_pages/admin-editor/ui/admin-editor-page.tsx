import { notFound } from "next/navigation"

import { getBlogAssets } from "@/entities/asset/index.server"
import { getAdminPost, getCategories } from "@/entities/post/index.server"
import { PostEditor } from "@/features/post-editor"

interface AdminEditorPageProps {
  postId?: number
}

export async function AdminEditorPage({ postId }: AdminEditorPageProps) {
  const [categories, assets, post] = await Promise.all([
    getCategories(),
    getBlogAssets(),
    postId ? getAdminPost(postId) : Promise.resolve(undefined),
  ])

  if (postId && !post) notFound()

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">
          {post ? "글 수정" : "새 글 작성"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          본문과 검색 노출 정보를 함께 관리합니다.
        </p>
      </div>
      <PostEditor
        categories={categories}
        assets={assets}
        post={post ?? undefined}
      />
    </div>
  )
}
