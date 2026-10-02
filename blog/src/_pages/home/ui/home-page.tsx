import Link from "next/link"
import { ArrowUpRight, FileText } from "lucide-react"

import { getCategories, getPublishedPosts } from "@/entities/post/index.server"
import { cn, formatDate } from "@/shared/lib"

interface HomePageProps {
  category?: string
}

export async function HomePage({ category }: HomePageProps) {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(category),
    getCategories(),
  ])
  const selectedCategory = categories.find((item) => item.slug === category)

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 md:pb-32">
      <section
        className="grid gap-8 py-16 md:grid-cols-[1.5fr_1fr] md:items-end md:gap-16 md:py-24"
        aria-labelledby="intro-heading"
      >
        <h1
          id="intro-heading"
          className="text-[2.5rem]/[1.22] font-semibold tracking-[-0.055em] text-balance sm:text-5xl/[1.22] lg:text-[3.5rem]"
        >
          더 나은 코드를 위한
          <br />
          작은 기록들.
        </h1>
        <p className="max-w-sm text-sm/7 text-muted-foreground md:pb-1 md:text-base/8">
          개발하며 마주한 질문과 해결의 과정.
          <br />
          직접 배우고 경험한 것들을 차곡차곡 담습니다.
        </p>
      </section>
      <section aria-labelledby="posts-heading">
        <div className="flex items-center justify-between border-t border-foreground/75 pt-7">
          <h2
            id="posts-heading"
            className="text-xl font-semibold tracking-tight"
          >
            {selectedCategory?.title ?? "글"}
          </h2>
          <span className="text-xs text-muted-foreground tabular-nums">
            {posts.length}개의 글
          </span>
        </div>
        <nav
          className="mt-6 flex flex-wrap gap-2 border-b pb-6"
          aria-label="카테고리 필터"
        >
          {[{ id: 0, title: "전체", slug: "" }, ...categories].map((item) => {
            const active = item.slug === (category ?? "")
            return (
              <Link
                key={item.id}
                href={
                  item.slug
                    ? `/?category=${encodeURIComponent(item.slug)}`
                    : "/"
                }
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-transparent bg-muted/70 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center border-b py-24 text-center">
            <FileText
              className="mb-5 size-7 text-muted-foreground"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <h3 className="text-base font-medium">작성된 글이 없습니다.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {category
                ? "다른 카테고리의 글을 살펴보세요."
                : "새로운 개발 기록이 이곳에 쌓일 예정입니다."}
            </p>
            {category && (
              <Link
                href="/"
                className="mt-6 text-sm underline underline-offset-4"
              >
                전체 글 보기
              </Link>
            )}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <article key={post.id} className="border-b">
                <Link
                  href={`/posts/${post.slug}`}
                  className="group grid gap-4 py-8 transition-colors hover:bg-muted/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:grid-cols-[8rem_minmax(0,1fr)_2rem] md:gap-8 md:py-10"
                >
                  <div className="flex items-center gap-3 text-xs text-muted-foreground md:flex-col md:items-start md:gap-3 md:pt-1">
                    {post.category && (
                      <span className="font-medium text-foreground">
                        {post.category.title}
                      </span>
                    )}
                    <time
                      className="tabular-nums"
                      dateTime={post.publishedAt ?? post.createdAt}
                    >
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </time>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl/8 font-semibold tracking-[-0.035em] text-pretty md:text-2xl/9">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm/7 text-muted-foreground md:text-[15px]/7">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-xs text-muted-foreground">
                        {post.tags.map((tag) => (
                          <span key={tag.id}>#{tag.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowUpRight
                    className="hidden size-5 text-muted-foreground transition-colors group-hover:text-foreground md:mt-2 md:block"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
