export interface BlogAsset {
  path: string
  name: string
  publicUrl: string
  mimeType: string
  size: number
  createdAt: string
}

export type BlogAssetDirectory = "covers" | "posts" | "library"
