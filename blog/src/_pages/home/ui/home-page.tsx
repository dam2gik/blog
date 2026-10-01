import Link from "next/link"

import { getCategories, getPublishedPosts } from "@/entities/post/index.server"
import { formatDate } from "@/shared/lib"
import { Button } from "@/shared/ui"

const copy = {
  title: "글",
  categoryFilter: "카테고리 필터",
  all: "전체",
  empty: "작성된 글이 없습니다.",
} as const

interface HomePageProps {
  category?: string
}

export async function HomePage({ category }: HomePageProps) {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(category),
    getCategories(),
  ])

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 md:py-14">
      <section aria-labelledby="posts-heading">
        <div className="flex items-end justify-between">
          <h1
            id="posts-heading"
            className="text-2xl font-semibold tracking-[-0.035em]"
          >
            {category
              ? (categories.find((item) => item.slug === category)?.title ??
                copy.title)
              : copy.title}
          </h1>
          <span className="pb-0.5 text-sm text-muted-foreground">
            {posts.length}개의 글
          </span>
        </div>

        <nav
          className="mt-6 flex gap-1 overflow-x-auto border-b"
          aria-label={copy.categoryFilter}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`-mb-px shrink-0 rounded-none border-b-2 border-transparent px-3 hover:bg-transparent ${
              category
                ? "border-b-transparent text-muted-foreground"
                : "border-b-foreground text-foreground"
            }`}
            nativeButton={false}
            render={<Link href="/" />}
          >
            {copy.all}
          </Button>
          {categories.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`-mb-px shrink-0 rounded-none border-b-2 border-transparent px-3 hover:bg-transparent ${
                category === item.slug
                  ? "border-b-foreground text-foreground"
                  : "border-b-transparent text-muted-foreground"
              }`}
              nativeButton={false}
              render={<Link href={`/?category=${item.slug}`} />}
            >
              {item.title}
            </Button>
          ))}
        </nav>

        {posts.length === 0 ? (
          <div className="border-b py-20 text-center text-sm text-muted-foreground">
            {copy.empty}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <article
                key={post.id}
                className="grid gap-2 border-b py-6 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-6"
              >
                <time
                  className="pt-1 text-xs text-muted-foreground"
                  dateTime={post.publishedAt ?? post.createdAt}
                >
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </time>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-[-0.025em] md:text-xl">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="underline-offset-4 hover:text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm/6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  {(post.category || post.tags.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {post.category && <span>{post.category.title}</span>}
                      {post.tags.map((tag) => (
                        <span key={tag.id}>#{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
