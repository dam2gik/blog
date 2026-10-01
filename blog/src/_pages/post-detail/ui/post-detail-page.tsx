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
    <article className="mx-auto w-full max-w-3xl px-5 py-10 md:py-14">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/" />}
      >
        {"\u2190"} 글 목록
      </Button>

      <header className="mt-7 border-b pb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {post.category && <span>{post.category.title}</span>}
          {post.category && <span aria-hidden>{"\u00b7"}</span>}
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl/12">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 max-w-2xl text-base/7 text-muted-foreground">
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

      <div className="mt-9">
        <PostContent content={post.content} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </article>
  )
}
