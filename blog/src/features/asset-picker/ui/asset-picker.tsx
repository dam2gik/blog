"use client"

import { Check, ImageIcon } from "lucide-react"

import type { BlogAsset } from "@/entities/asset"
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui"

interface AssetPickerProps {
  assets: BlogAsset[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (asset: BlogAsset) => void
  selectedUrl?: string
}

export function AssetPicker({
  assets,
  open,
  onOpenChange,
  onSelect,
  selectedUrl,
}: AssetPickerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-5">
          <SheetTitle>에셋에서 선택</SheetTitle>
          <SheetDescription>
            이미 업로드한 이미지를 다시 사용할 수 있습니다.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3 overflow-y-auto p-5 sm:grid-cols-3">
          {assets.length > 0 ? (
            assets.map((asset) => {
              const selected = asset.publicUrl === selectedUrl

              return (
                <Button
                  key={asset.path}
                  type="button"
                  variant="ghost"
                  className="group relative h-auto min-w-0 flex-col items-stretch gap-2 overflow-hidden rounded-lg border bg-background p-2 text-left hover:bg-muted/40"
                  onClick={() => {
                    onSelect(asset)
                    onOpenChange(false)
                  }}
                >
                  <span className="relative aspect-square overflow-hidden rounded-md bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.publicUrl}
                      alt={asset.name}
                      className="size-full object-cover transition-transform group-hover:scale-[1.02]"
                    />
                    {selected ? (
                      <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-foreground text-background">
                        <Check className="size-3.5" />
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate px-0.5 text-xs font-medium">
                    {asset.name}
                  </span>
                </Button>
              )
            })
          ) : (
            <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 text-center">
              <ImageIcon className="mb-3 size-6 text-muted-foreground" />
              <p className="text-sm font-medium">저장된 이미지가 없습니다.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                먼저 이미지를 업로드해 주세요.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
