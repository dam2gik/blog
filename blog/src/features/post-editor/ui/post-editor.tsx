"use client"

import type { Editor, JSONContent } from "@tiptap/react"
import { EditorContent, useEditor } from "@tiptap/react"
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Code2,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Paperclip,
  Quote,
  Redo2,
  UnderlineIcon,
  Undo2,
} from "lucide-react"
import { useActionState, useRef, useState } from "react"

import {
  createEditorExtensions,
  type BlogCategory,
  type BlogPost,
} from "@/entities/post"
import { createSupabaseBrowserClient } from "@/shared/api/supabase"
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
}: {
  editor: Editor
  uploading: boolean
  onUpload: (file: File) => Promise<void>
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined
    const url = window.prompt(
      "연결할 주소를 입력하세요.",
      previousUrl ?? "https://"
    )
    if (url === null) return
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b bg-background p-2">
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
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
      </ToolbarButton>
      <ToolbarButton
        label="파일 첨부"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip />
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void onUpload(file)
          event.target.value = ""
        }}
      />
    </div>
  )
}

export function PostEditor({ categories, post }: PostEditorProps) {
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
  const [uploadError, setUploadError] = useState<string>()
  const editor = useEditor({
    extensions: createEditorExtensions(),
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[520px] px-5 py-5 text-[15px]/7 focus:outline-none",
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
      const supabase = createSupabaseBrowserClient()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-")
      const path = `posts/${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`
      const { error } = await supabase.storage
        .from("blog-assets")
        .upload(path, file, { cacheControl: "31536000", upsert: false })

      if (error) throw error

      const { data } = supabase.storage.from("blog-assets").getPublicUrl(path)
      if (file.type.startsWith("image/")) {
        editor
          .chain()
          .focus()
          .setImage({ src: data.publicUrl, alt: file.name })
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
                attrs: { href: data.publicUrl, target: "_blank" },
              },
            ],
          })
          .run()
      }
    } catch {
      setUploadError("파일을 업로드하지 못했습니다.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <form
      action={formAction}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]"
    >
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <input type="hidden" name="contentText" value={contentText} />

      <div className="min-w-0 space-y-4">
        <div>
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
            placeholder="제목"
            className="h-auto border-0 px-0 py-2 text-3xl font-semibold tracking-[-0.04em] shadow-none focus-visible:ring-0"
            maxLength={120}
            required
          />
        </div>
        <div className="overflow-hidden rounded-lg border bg-background">
          {editor && (
            <EditorToolbar
              editor={editor}
              uploading={uploading}
              onUpload={uploadAsset}
            />
          )}
          <EditorContent editor={editor} />
        </div>
        {(state.error || uploadError) && (
          <p role="alert" className="text-sm text-destructive">
            {state.error ?? uploadError}
          </p>
        )}
      </div>

      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <div className="space-y-3 rounded-lg border p-4">
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
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">카테고리</Label>
            <Select
              name="categoryId"
              defaultValue={post?.category?.id.toString() ?? "none"}
            >
              <SelectTrigger id="categoryId">
                <SelectValue />
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
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">대표 이미지 URL</Label>
            <Input
              id="coverImageUrl"
              name="coverImageUrl"
              defaultValue={post?.coverImageUrl ?? ""}
              type="url"
              placeholder="https://"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
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
        </div>
      </aside>
    </form>
  )
}
