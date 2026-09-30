import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

import { getAdminPosts } from "@/entities/post/index.server"
import { formatDate } from "@/shared/lib"
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui"

import { deletePostAction } from "../api/delete-post"

export async function AdminPostsPage() {
  const posts = await getAdminPosts()

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">글 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            발행 상태와 글 내용을 관리합니다.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/posts/new" />}>
          <Plus />새 글
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead className="hidden sm:table-cell">카테고리</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="hidden md:table-cell">수정일</TableHead>
              <TableHead className="w-28 text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-[280px]">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="block truncate font-medium hover:underline"
                  >
                    {post.title}
                  </Link>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    /{post.slug}
                  </span>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {post.category?.title ?? "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                  >
                    {post.status === "published" ? "발행" : "임시저장"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatDate(post.updatedAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    {post.status === "published" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="공개 글 보기"
                        nativeButton={false}
                        render={
                          <Link href={`/posts/${post.slug}`} target="_blank" />
                        }
                      >
                        <ExternalLink />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="글 수정"
                      nativeButton={false}
                      render={<Link href={`/admin/posts/${post.id}/edit`} />}
                    >
                      <Pencil />
                    </Button>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="글 삭제"
                      >
                        <Trash2 />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  작성된 글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
