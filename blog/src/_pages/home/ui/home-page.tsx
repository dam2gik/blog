import Link from "next/link"

import { getCategories, getPublishedPosts } from "@/entities/post/index.server"
import { formatDate } from "@/shared/lib"
import { Badge, Button } from "@/shared/ui"

const copy = {
  headline: "\uc624\ub798 \ub0a8\uae38 \uc0dd\uac01\uc744 \uc501\ub2c8\ub2e4.",
  description:
    "\uac1c\ubc1c\ud558\uba70 \ubc30\uc6b4 \uac83\uacfc \uc77c\uc0c1\uc758 \uc791\uc740 \ubc1c\uacac\uc744 \uc815\ub9ac\ud569\ub2c8\ub2e4. \ube60\ub974\uac8c \uc18c\ube44\ub418\ub294 \uc815\ubcf4\ubcf4\ub2e4 \ub2e4\uc2dc \ucc3e\uc544\ubcfc \uc218 \uc788\ub294 \uae30\ub85d\uc744 \uc9c0\ud5a5\ud569\ub2c8\ub2e4.",
  categoryFilter: "\uce74\ud14c\uace0\ub9ac \ud544\ud130",
  all: "\uc804\uccb4",
  post: "\uae00",
  recentPosts: "\ucd5c\uadfc \uae00",
  empty:
    "\uc544\uc9c1 \uacf5\uac1c\ub41c \uae00\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.",
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
    <div className="mx-auto w-full max-w-5xl px-5 py-12 md:py-16">
      <section className="max-w-2xl border-b pb-10">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          {copy.headline}
        </h1>
        <p className="mt-4 max-w-xl text-sm/6 text-muted-foreground md:text-base/7">
          {copy.description}
        </p>
      </section>

      <div
        className="mt-8 flex flex-wrap gap-2"
        aria-label={copy.categoryFilter}
      >
        <Button
          variant={category ? "ghost" : "secondary"}
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
        >
          {copy.all}
        </Button>
        {categories.map((item) => (
          <Button
            key={item.id}
            variant={category === item.slug ? "secondary" : "ghost"}
            size="sm"
            nativeButton={false}
            render={<Link href={`/?category=${item.slug}`} />}
          >
            {item.title}
          </Button>
        ))}
      </div>

      <section className="mt-8" aria-labelledby="recent-posts">
        <div className="flex items-end justify-between border-b pb-3">
          <h2 id="recent-posts" className="text-base font-semibold">
            {category
              ? (categories.find((item) => item.slug === category)?.title ??
                copy.post)
              : copy.recentPosts}
          </h2>
          <span className="text-xs text-muted-foreground">
            {posts.length}
            {"\uac1c"}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {copy.empty}
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <article key={post.id} className="border-b py-6">
                <div className="max-w-2xl min-w-0">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    {post.category && <span>{post.category.title}</span>}
                    {post.category && <span aria-hidden>{"\u00b7"}</span>}
                    <time dateTime={post.publishedAt ?? post.createdAt}>
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </time>
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm/6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                          #{tag.name}
                        </Badge>
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
