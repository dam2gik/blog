"use client"

import { createSupabaseBrowserClient } from "@/shared/api/supabase"

import type { BlogAsset, BlogAssetDirectory } from "../model/asset"

const ASSET_BUCKET = "blog-assets"
const MAX_ASSET_SIZE = 10 * 1024 * 1024

function createAssetPath(file: File, directory: BlogAssetDirectory) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
  return `${directory}/${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`
}

export async function uploadBlogAsset(
  file: File,
  directory: BlogAssetDirectory
): Promise<BlogAsset> {
  if (file.size > MAX_ASSET_SIZE) {
    throw new Error("파일 크기는 10MB 이하여야 합니다.")
  }

  const supabase = createSupabaseBrowserClient()
  const path = createAssetPath(file, directory)
  const { data, error } = await supabase.storage
    .from(ASSET_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    })

  if (error) throw error

  const publicUrl = supabase.storage.from(ASSET_BUCKET).getPublicUrl(data.path)
    .data.publicUrl

  return {
    path: data.path,
    name: file.name,
    publicUrl,
    mimeType: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  }
}

export async function removeBlogAsset(path: string) {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.storage.from(ASSET_BUCKET).remove([path])

  if (error) throw error
}
