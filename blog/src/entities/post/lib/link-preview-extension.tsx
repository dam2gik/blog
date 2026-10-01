"use client"

import { Extension, mergeAttributes, Node } from "@tiptap/core"
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react"
import { Fragment } from "@tiptap/pm/model"
import { TextSelection } from "@tiptap/pm/state"
import { useEffect, useState } from "react"

import { LinkPreviewCard } from "../ui/link-preview-card"

const STANDALONE_URL =
  /^(?:https?:\/\/[^\s]+|www\.[^\s]+|(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:[/?#][^\s]*)?)$/i

interface LinkPreviewData {
  title: string
  description: string
  image: string
  siteName: string
}

function normalizePreviewUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

function LinkPreviewNodeView({ node, updateAttributes }: NodeViewProps) {
  const { url, title, description, image, siteName } = node.attrs as {
    url: string
    title: string | null
    description: string | null
    image: string | null
    siteName: string | null
  }
  const [loading, setLoading] = useState(!title)

  useEffect(() => {
    if (title) return

    const controller = new AbortController()

    async function loadPreview() {
      try {
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`,
          { signal: controller.signal }
        )
        if (!response.ok) return

        const preview = (await response.json()) as LinkPreviewData
        updateAttributes(preview)
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Failed to load link preview", error)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadPreview()
    return () => controller.abort()
  }, [title, updateAttributes, url])

  return (
    <NodeViewWrapper className="link-preview-node" contentEditable={false}>
      <LinkPreviewCard
        url={url}
        title={title}
        description={description}
        image={image}
        siteName={siteName}
        loading={!title && loading}
      />
    </NodeViewWrapper>
  )
}

export const LinkPreview = Node.create({
  name: "linkPreview",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      url: { default: "" },
      title: { default: null },
      description: { default: null },
      image: { default: null },
      siteName: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="link-preview"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "link-preview" }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewNodeView)
  },
})

export const LinkPreviewOnEnter = Extension.create({
  name: "linkPreviewOnEnter",
  priority: 1_000,

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { state, view } = this.editor
        const { $from, empty } = state.selection
        if (!empty || $from.parent.type.name !== "paragraph") return false

        const text = $from.parent.textContent
        if (text !== text.trim() || !STANDALONE_URL.test(text)) return false

        const linkType = state.schema.marks.link
        const previewType = state.schema.nodes.linkPreview
        const paragraphType = state.schema.nodes.paragraph
        if (!linkType || !previewType || !paragraphType) return false

        const url = normalizePreviewUrl(text)
        const from = $from.start()
        const to = from + $from.parent.content.size
        const insertAt = $from.after()
        const previewNode = previewType.create({ url })
        const paragraphNode = paragraphType.create()
        const transaction = state.tr
          .addMark(
            from,
            to,
            linkType.create({
              href: url,
              target: "_blank",
              rel: "noopener noreferrer nofollow",
            })
          )
          .insert(insertAt, Fragment.fromArray([previewNode, paragraphNode]))

        transaction.setSelection(
          TextSelection.near(
            transaction.doc.resolve(insertAt + previewNode.nodeSize + 1)
          )
        )
        view.dispatch(transaction.scrollIntoView())
        return true
      },
    }
  },
})
