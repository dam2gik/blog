import { generatePostMetadata, PostDetailPage } from "@/_pages/post-detail"

interface PageProps {
  params: Promise<{ slug: string }>
}

function getPostSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  return generatePostMetadata(getPostSlug(slug))
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  return <PostDetailPage slug={getPostSlug(slug)} />
}

export const dynamic = "force-dynamic"
