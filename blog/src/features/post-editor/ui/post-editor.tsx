"use client"

import type { Editor, JSONContent } from "@tiptap/react"
import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Braces,
  Code2,
  Heading2,
  ImageIcon,
  Images,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Paperclip,
  Quote,
  Redo2,
  Upload,
  UnderlineIcon,
  Undo2,
  X,
} from "lucide-react"
import { useActionState, useRef, useState } from "react"

import { type BlogAsset, uploadBlogAsset } from "@/entities/asset"
import {
  CODE_LANGUAGES,
  createEditorExtensions,
  getCodeLanguage,
  type BlogCategory,
  type BlogPost,
} from "@/entities/post"
import { AssetPicker } from "@/features/asset-picker"
import { slugify } from "@/shared/lib"
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui"

import { savePostAction, type SavePostState } from "../api/save-post"

interface PostEditorProps {
  categories: BlogCategory[]
  assets: BlogAsset[]
  post?: BlogPost
}

interface ToolbarButtonProps {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}

const initialState: SavePostState = {}

function normalizeLinkUrl(value: string) {
  const url = value.trim()
  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url
  return `https://${url}`
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="icon-sm"
            disabled={disabled}
            onClick={onClick}
            aria-label={label}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function EditorToolbar({
  editor,
  uploading,
  onUpload,
  onOpenAssetPicker,
}: {
  editor: Editor
  uploading: boolean
  onUpload: (file: File) => Promise<void>
  onOpenAssetPicker: () => void
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const codeLanguage = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) =>
      currentEditor.isActive("codeBlock")
        ? getCodeLanguage(currentEditor.getAttributes("codeBlock").language)
        : null,
  })
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined
    const input = window.prompt(
      "연결할 주소를 입력하세요.",
      previousUrl ?? "https://"
    )
    if (input === null) return
    if (!input.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    const url = normalizeLinkUrl(input)
    if (editor.state.selection.empty) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: url,
          marks: [{ type: "link", attrs: { href: url, target: "_blank" } }],
        })
        .run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-2">
      <ToolbarButton
        label="실행 취소"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        label="다시 실행"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 />
      </ToolbarButton>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton
        label="제목"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton
        label="굵게"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="기울임"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="밑줄"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon />
      </ToolbarButton>
      <ToolbarButton
        label="코드"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code2 />
      </ToolbarButton>
      <ToolbarButton
        label="코드 블록"
        active={codeLanguage !== null}
        onClick={() =>
          editor.chain().focus().toggleCodeBlock({ language: "plaintext" }).run()
        }
      >
        <Braces />
      </ToolbarButton>
      {codeLanguage !== null && (
        <Select
          value={codeLanguage}
          items={Object.fromEntries(
            CODE_LANGUAGES.map(({ value, label }) => [value, label])
          )}
          onValueChange={(value) => {
            if (typeof value === "string") {
              editor
                .chain()
                .focus()
                .updateAttributes("codeBlock", { language: value })
                .run()
            }
          }}
        >
          <SelectTrigger size="sm" aria-label="코드 언어" className="mx-1 min-w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CODE_LANGUAGES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <ToolbarButton
        label="링크"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <Link2 />
      </ToolbarButton>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton
        label="글머리 목록"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="번호 목록"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        label="인용"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote />
      </ToolbarButton>
      <ToolbarButton
        label="왼쪽 정렬"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft />
      </ToolbarButton>
      <ToolbarButton
        label="가운데 정렬"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter />
      </ToolbarButton>
      <Separator orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton
        label="이미지 업로드"
        disabled={uploading}
        onClick={() => imageInputRef.current?.click()}
      >
        {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
      </ToolbarButton>
      <ToolbarButton label="에셋에서 이미지 선택" onClick={onOpenAssetPicker}>
        <Images />
      </ToolbarButton>
      <ToolbarButton
        label="파일 첨부"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip />
      </ToolbarButton>
      <input
        ref={imageInputRef}
        type="file"
        className="sr-only"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void onUpload(file)
          event.target.value = ""
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept="application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void onUpload(file)
          event.target.value = ""
        }}
      />
    </div>
  )
}

export function PostEditor({ categories, assets, post }: PostEditorProps) {
  const [state, formAction, pending] = useActionState(
    savePostAction,
    initialState
  )
  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [content, setContent] = useState<JSONContent>(
    post?.content ?? { type: "doc", content: [{ type: "paragraph" }] }
  )
  const [contentText, setContentText] = useState(post?.contentText ?? "")
  const [uploading, setUploading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "")
  const [assetOptions, setAssetOptions] = useState(assets)
  const [assetPickerOpen, setAssetPickerOpen] = useState(false)
  const [assetTarget, setAssetTarget] = useState<"cover" | "editor">("cover")
  const [uploadError, setUploadError] = useState<string>()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const editor = useEditor({
    extensions: createEditorExtensions(),
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[560px] bg-background px-6 py-6 text-[15px]/7 focus:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      setContent(currentEditor.getJSON())
      setContentText(currentEditor.getText({ blockSeparator: "\n" }))
    },
  })

  const uploadAsset = async (file: File) => {
    if (!editor) return
    setUploading(true)
    setUploadError(undefined)

    try {
      const asset = await uploadBlogAsset(file, "posts")
      setAssetOptions((current) => [asset, ...current])
      if (file.type.startsWith("image/")) {
        editor
          .chain()
          .focus()
          .setImage({ src: asset.publicUrl, alt: file.name })
          .run()
      } else {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text: file.name,
            marks: [
              {
                type: "link",
                attrs: { href: asset.publicUrl, target: "_blank" },
              },
            ],
          })
          .run()
      }
    } catch (error) {
      console.error("Failed to upload post asset", error)
      setUploadError("파일을 업로드하지 못했습니다.")
    } finally {
      setUploading(false)
    }
  }

  const uploadCoverImage = async (file: File) => {
    setCoverUploading(true)
    setUploadError(undefined)

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("invalid file type")
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("file too large")
      }

      const asset = await uploadBlogAsset(file, "covers")
      setAssetOptions((current) => [asset, ...current])
      setCoverImageUrl(asset.publicUrl)
    } catch (error) {
      console.error("Failed to upload cover image", error)
      setUploadError("대표 이미지를 업로드하지 못했습니다.")
    } finally {
      setCoverUploading(false)
    }
  }

  return (
    <form
      action={formAction}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <input type="hidden" name="contentText" value={contentText} />
      <input type="hidden" name="coverImageUrl" value={coverImageUrl} />

      <div className="min-w-0">
        <div className="overflow-hidden rounded-xl border bg-background">
          <div className="border-b px-6 py-4">
            <Label htmlFor="title" className="sr-only">
              제목
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={() => {
                if (!slug) setSlug(slugify(title))
              }}
              placeholder="제목을 입력하세요"
              className="h-auto rounded-none border-0 px-0 py-1 text-3xl font-semibold tracking-[-0.04em] shadow-none focus-visible:ring-0"
              maxLength={120}
              required
            />
          </div>
          {editor && (
            <EditorToolbar
              editor={editor}
              uploading={uploading}
              onUpload={uploadAsset}
              onOpenAssetPicker={() => {
                setAssetTarget("editor")
                setAssetPickerOpen(true)
              }}
            />
          )}
          <EditorContent editor={editor} />
        </div>
        {(state.error || uploadError) && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {state.error ?? uploadError}
          </p>
        )}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-xl border bg-background p-5">
          <h2 className="mb-4 text-sm font-semibold">발행</h2>
          <div className="flex gap-2">
            <Button
              type="submit"
              name="status"
              value="draft"
              variant="outline"
              className="flex-1"
              disabled={pending}
            >
              임시 저장
            </Button>
            <Button
              type="submit"
              name="status"
              value="published"
              className="flex-1"
              disabled={pending}
            >
              {pending && <Loader2 className="animate-spin" />}발행
            </Button>
          </div>
        </section>

        <section className="space-y-5 rounded-xl border bg-background p-5">
          <h2 className="text-sm font-semibold">글 설정</h2>
          <div className="space-y-2">
            <Label htmlFor="categoryId">카테고리</Label>
            <Select
              name="categoryId"
              defaultValue={post?.category?.id.toString() ?? "none"}
              items={Object.fromEntries([
                ["none", "분류 없음"],
                ...categories.map((category) => [
                  category.id.toString(),
                  category.title,
                ]),
              ])}
            >
              <SelectTrigger id="categoryId" className="w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">분류 없음</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">태그</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={post?.tags.map((tag) => tag.name).join(", ")}
              placeholder="Next.js, 기록"
            />
            <p className="text-xs text-muted-foreground">
              쉼표로 구분하며 최대 10개까지 저장합니다.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">글 주소</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              placeholder="post-url"
              required
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border bg-background p-5">
          <div>
            <h2 className="text-sm font-semibold">대표 이미지</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG, WebP, GIF · 최대 10MB
            </p>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void uploadCoverImage(file)
              event.target.value = ""
            }}
          />
          {coverImageUrl ? (
            <div className="space-y-3">
              <div className="relative flex max-h-64 justify-center overflow-hidden rounded-lg border bg-muted/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="대표 이미지 미리보기"
                  className="block h-auto max-h-64 w-auto max-w-full object-contain"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  aria-label="대표 이미지 제거"
                  onClick={() => setCoverImageUrl("")}
                >
                  <X />
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={coverUploading}
                onClick={() => coverInputRef.current?.click()}
              >
                {coverUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload />
                )}
                이미지 변경
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setAssetTarget("cover")
                  setAssetPickerOpen(true)
                }}
              >
                <Images />
                에셋에서 선택
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-auto flex-col gap-2 border-dashed py-6 text-muted-foreground"
                disabled={coverUploading}
                onClick={() => coverInputRef.current?.click()}
              >
                {coverUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload className="size-5" />
                )}
                업로드
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto flex-col gap-2 border-dashed py-6 text-muted-foreground"
                onClick={() => {
                  setAssetTarget("cover")
                  setAssetPickerOpen(true)
                }}
              >
                <Images className="size-5" />
                에셋 선택
              </Button>
            </div>
          )}
        </section>

        <section className="space-y-5 rounded-xl border bg-background p-5">
          <h2 className="text-sm font-semibold">검색 노출</h2>
          <div className="space-y-2">
            <Label htmlFor="excerpt">요약</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              maxLength={300}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO 제목</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              defaultValue={post?.seoTitle ?? ""}
              maxLength={60}
              placeholder="비워두면 글 제목 사용"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO 설명</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={post?.seoDescription ?? ""}
              maxLength={160}
              rows={3}
              placeholder="비워두면 요약 사용"
            />
          </div>
        </section>
      </aside>

      <AssetPicker
        assets={assetOptions}
        open={assetPickerOpen}
        onOpenChange={setAssetPickerOpen}
        selectedUrl={assetTarget === "cover" ? coverImageUrl : undefined}
        onSelect={(asset) => {
          if (assetTarget === "cover") {
            setCoverImageUrl(asset.publicUrl)
            return
          }

          editor
            ?.chain()
            .focus()
            .setImage({ src: asset.publicUrl, alt: asset.name })
            .run()
        }}
      />
    </form>
  )
}
