import { getBlogAssets } from "@/entities/asset/index.server"

import { AssetManager } from "./asset-manager"

export async function AdminAssetsPage() {
  const assets = await getBlogAssets()

  return (
    <div className="mx-auto max-w-[1440px]">
      <AssetManager initialAssets={assets} />
    </div>
  )
}
