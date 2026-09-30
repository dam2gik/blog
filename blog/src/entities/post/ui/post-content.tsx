import { createElement, Fragment, type ReactNode } from "react"
import type { JSONContent } from "@tiptap/react"

interface PostContentProps {
  content: JSONContent
}

function renderText(node: JSONContent, key: string): ReactNode {
  let content: ReactNode = node.text ?? ""

  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = <strong>{content}</strong>
    if (mark.type === "italic") content = <em>{content}</em>
    if (mark.type === "underline") content = <u>{content}</u>
    if (mark.type === "strike") content = <s>{content}</s>
    if (mark.type === "code") content = <code>{content}</code>
    if (mark.type === "link") {
      content = (
        <a
          href={String(mark.attrs?.href ?? "#")}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {content}
        </a>
      )
    }
  }

  return <Fragment key={key}>{content}</Fragment>
}

function renderNode(node: JSONContent, key: string): ReactNode {
  if (node.type === "text") return renderText(node, key)

  const children = node.content?.map((child, index) =>
    renderNode(child, `${key}-${index}`)
  )
  const style = node.attrs?.textAlign
    ? { textAlign: node.attrs.textAlign as "left" | "center" | "right" }
    : undefined

  switch (node.type) {
    case "doc":
      return <Fragment key={key}>{children}</Fragment>
    case "paragraph":
      return (
        <p key={key} style={style}>
          {children}
        </p>
      )
    case "heading":
      return createElement(
        `h${Number(node.attrs?.level ?? 2)}`,
        { key, style },
        children
      )
    case "bulletList":
      return <ul key={key}>{children}</ul>
    case "orderedList":
      return <ol key={key}>{children}</ol>
    case "listItem":
      return <li key={key}>{children}</li>
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      )
    case "hardBreak":
      return <br key={key} />
    case "horizontalRule":
      return <hr key={key} />
    case "image":
      return (
        // Tiptap image URLs are restricted to the administrator-controlled Storage bucket.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={String(node.attrs?.src ?? "")}
          alt={String(node.attrs?.alt ?? "")}
          loading="lazy"
        />
      )
    default:
      return <Fragment key={key}>{children}</Fragment>
  }
}

export function PostContent({ content }: PostContentProps) {
  return <div className="blog-content">{renderNode(content, "content")}</div>
}
