import Link from "next/link"
import { notFound } from "next/navigation"

import { getPublishedPost, PostContent } from "@/entities/post/index.server"
import { siteConfig } from "@/shared/config"
import { formatDate } from "@/shared/lib"
import { Badge, Button } from "@/shared/ui"

interface PostDetailPageProps {
  slug: string
}

export async function PostDetailPage({ slug }: PostDetailPageProps) {
  const post = await getPublishedPost(slug)

  if (!post) {
    notFound()
  }

  const publishedAt = post.publishedAt ?? post.createdAt
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    datePublished: publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: siteConfig.author },
    publisher: { "@type": "Person", name: siteConfig.author },
    mainEntityOfPage: `${siteConfig.url}/posts/${post.slug}`,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-10 md:pt-14 md:pb-24">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/" />}
      >
        {"\u2190"} 글 목록
      </Button>

      <header className="mt-10 border-b pb-10 md:mt-14 md:pb-12">
        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {post.category && <span>{post.category.title}</span>}
          {post.category && <span aria-hidden>{"\u00b7"}</span>}
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
        <h1 className="text-3xl/10 font-semibold tracking-[-0.045em] text-pretty md:text-5xl/[1.3]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-6 max-w-2xl text-base/8 text-muted-foreground md:text-lg/8">
            {post.excerpt}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {post.coverImageUrl && (
        <div className="mt-8 flex justify-center">
          {/* The uploaded image has no stored dimensions; use its intrinsic ratio. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImageUrl}
            alt=""
            fetchPriority="high"
            className="block h-auto max-h-[min(65vh,560px)] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      )}

      <div className="mt-10 md:mt-12">
        <PostContent content={post.content} />
      </div>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t pt-8 text-sm">
        <p className="text-muted-foreground">
          Written by{" "}
          <span className="font-medium text-foreground">
            {siteConfig.author}
          </span>
        </p>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center underline underline-offset-4"
        >
          전체 글 보기
        </Link>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  )
}
