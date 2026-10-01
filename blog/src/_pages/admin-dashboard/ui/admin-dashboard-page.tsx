import { FileText, FolderTree, Plus, Send } from "lucide-react"
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
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">
            대시보드
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            콘텐츠 현황과 최근 작업을 확인합니다.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/posts/new" />}>
          <Plus />새 글 작성
        </Button>
      </div>

      <section className="grid overflow-hidden rounded-xl border bg-background sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 border-b px-5 py-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
          >
            <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
              <stat.icon className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-xl border bg-background">
        <div className="flex h-14 items-center justify-between border-b px-5">
          <h2 className="font-semibold">최근 수정한 글</h2>
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
              className="flex items-center justify-between gap-4 border-b px-5 py-4 last:border-b-0"
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
            <p className="px-5 py-16 text-center text-sm text-muted-foreground">
              작성된 글이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
