"use client"

import {
  Check,
  Copy,
  ImageIcon,
  Loader2,
  Search,
  Trash2,
  Upload,
} from "lucide-react"
import { useMemo, useRef, useState } from "react"

import {
  type BlogAsset,
  removeBlogAsset,
  uploadBlogAsset,
} from "@/entities/asset"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
} from "@/shared/ui"

function formatFileSize(bytes: number) {
  if (!bytes) return "크기 정보 없음"
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export function AssetManager({
  initialAssets,
}: {
  initialAssets: BlogAsset[]
}) {
  const [assets, setAssets] = useState(initialAssets)
  const [query, setQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BlogAsset>()
  const [copiedPath, setCopiedPath] = useState<string>()
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filteredAssets = useMemo(
    () =>
      normalizedQuery
        ? assets.filter((asset) =>
            asset.name.toLocaleLowerCase().includes(normalizedQuery)
          )
        : assets,
    [assets, normalizedQuery]
  )

  const uploadAssets = async (files: FileList) => {
    setUploading(true)
    setError(undefined)

    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadBlogAsset(file, "library"))
      )
      setAssets((current) => [...uploaded, ...current])
    } catch (uploadError) {
      console.error("Failed to upload assets", uploadError)
      setError(
        "이미지를 업로드하지 못했습니다. 파일 형식과 크기를 확인해 주세요."
      )
    } finally {
      setUploading(false)
    }
  }

  const deleteAsset = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setError(undefined)

    try {
      await removeBlogAsset(deleteTarget.path)
      setAssets((current) =>
        current.filter((asset) => asset.path !== deleteTarget.path)
      )
      setDeleteTarget(undefined)
    } catch (deleteError) {
      console.error("Failed to delete asset", deleteError)
      setError("이미지를 삭제하지 못했습니다.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.03em]">
              에셋 관리
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              업로드한 이미지를 대표 이미지와 본문에서 다시 사용합니다.
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.length)
                void uploadAssets(event.target.files)
              event.target.value = ""
            }}
          />
          <Button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            이미지 업로드
          </Button>
        </div>

        <div className="rounded-xl border bg-background">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium">전체 {assets.length}개</p>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="파일명 검색"
                className="pl-9"
              />
            </div>
          </div>

          {error ? (
            <p className="mx-4 mt-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {filteredAssets.length > 0 ? (
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map((asset) => (
                <article
                  key={asset.path}
                  className="min-w-0 overflow-hidden rounded-lg border bg-background"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.publicUrl}
                      alt={asset.name}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 p-3">
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium"
                        title={asset.name}
                      >
                        {asset.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatFileSize(asset.size)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={async () => {
                          await navigator.clipboard.writeText(asset.publicUrl)
                          setCopiedPath(asset.path)
                          window.setTimeout(
                            () => setCopiedPath(undefined),
                            1500
                          )
                        }}
                      >
                        {copiedPath === asset.path ? <Check /> : <Copy />}
                        {copiedPath === asset.path ? "복사됨" : "URL 복사"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${asset.name} 삭제`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(asset)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
              <ImageIcon className="mb-3 size-7 text-muted-foreground" />
              <p className="text-sm font-medium">
                {query
                  ? "검색 결과가 없습니다."
                  : "업로드한 이미지가 없습니다."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {query
                  ? "다른 파일명으로 검색해 보세요."
                  : "첫 이미지를 업로드해 보세요."}
              </p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이미지를 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              이미 사용 중인 이미지라면 글에서도 표시되지 않습니다. 이 작업은
              되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void deleteAsset()}
            >
              {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
