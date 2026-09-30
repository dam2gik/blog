import { generatePostMetadata, PostDetailPage } from "@/_pages/post-detail"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  return generatePostMetadata(slug)
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  return <PostDetailPage slug={slug} />
}

export const dynamic = "force-dynamic"
