import { FileText, FolderTree, Send } from "lucide-react"
import Link from "next/link"

import { getAdminPosts, getCategories } from "@/entities/post/index.server"
import { formatDate } from "@/shared/lib"
import { Badge, Button } from "@/shared/ui"

export async function AdminDashboardPage() {
  const [posts, categories] = await Promise.all([
    getAdminPosts(),
    getCategories(),
  ])
  const publishedCount = posts.filter(
    (post) => post.status === "published"
  ).length
  const stats = [
    { label: "전체 글", value: posts.length, icon: FileText },
    { label: "발행 글", value: publishedCount, icon: Send },
    { label: "카테고리", value: categories.length, icon: FolderTree },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">대시보드</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            블로그 현황을 한눈에 확인합니다.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/posts/new" />}>
          새 글 작성
        </Button>
      </div>

      <section className="grid border-y sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 border-b px-4 py-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
          >
            <stat.icon className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-semibold">최근 수정한 글</h2>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/posts" />}
          >
            전체 보기
          </Button>
        </div>
        <div>
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 border-b py-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="truncate text-sm font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(post.updatedAt)}
                </p>
              </div>
              <Badge
                variant={post.status === "published" ? "default" : "secondary"}
              >
                {post.status === "published" ? "발행" : "임시저장"}
              </Badge>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              작성된 글이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
