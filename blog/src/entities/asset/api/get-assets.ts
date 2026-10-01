import "server-only"

import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

import type { BlogAsset } from "../model/asset"

const ASSET_BUCKET = "blog-assets"
const MAX_DIRECTORY_DEPTH = 4

interface StorageObject {
  id: string | null
  name: string
  created_at?: string
  updated_at?: string
  metadata?: {
    mimetype?: string
    size?: number
  } | null
}

export async function getBlogAssets(): Promise<BlogAsset[]> {
  const supabase = await createSupabaseServerClient()
  const bucket = supabase.storage.from(ASSET_BUCKET)

  async function listDirectory(prefix = "", depth = 0): Promise<BlogAsset[]> {
    const { data, error } = await bucket.list(prefix, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    })

    if (error) throw error

    const assets = await Promise.all(
      (data as StorageObject[]).map(async (item) => {
        const path = prefix ? `${prefix}/${item.name}` : item.name

        if (!item.id) {
          return depth < MAX_DIRECTORY_DEPTH
            ? listDirectory(path, depth + 1)
            : []
        }

        const mimeType = item.metadata?.mimetype ?? "application/octet-stream"
        if (!mimeType.startsWith("image/")) return []

        return [
          {
            path,
            name: item.name.replace(/^[0-9a-f-]{36}-/, ""),
            publicUrl: bucket.getPublicUrl(path).data.publicUrl,
            mimeType,
            size: item.metadata?.size ?? 0,
            createdAt: item.created_at ?? item.updated_at ?? "",
          } satisfies BlogAsset,
        ]
      })
    )

    return assets.flat()
  }

  const assets = await listDirectory()
  return assets.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
}
