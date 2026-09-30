import { HomePage } from "@/_pages/home"

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function Page({ searchParams }: PageProps) {
  const { category } = await searchParams
  return <HomePage category={category} />
}

export const dynamic = "force-dynamic"
