import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"

import { codeHighlighter, getCodeLanguageLabel } from "./code-languages"
import { LinkPreview, LinkPreviewOnEnter } from "./link-preview-extension"

const BlogCodeBlock = CodeBlockLowlight.extend({
  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || "plaintext"

    return [
      "pre",
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        "data-language": getCodeLanguageLabel(language),
      },
      ["code", { class: `language-${language}` }, 0],
    ]
  },
})

export function createEditorExtensions(placeholder = "본문을 작성하세요.") {
  return [
    StarterKit.configure({
      codeBlock: false,
      link: false,
      underline: false,
      heading: { levels: [2, 3, 4] },
    }),
    Underline,
    BlogCodeBlock.configure({
      lowlight: codeHighlighter,
      defaultLanguage: "plaintext",
      HTMLAttributes: { class: "code-block editor-code-block" },
      enableTabIndentation: true,
      tabSize: 2,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        rel: "noopener noreferrer nofollow",
      },
    }),
    LinkPreview,
    LinkPreviewOnEnter,
    Image.configure({
      allowBase64: false,
      HTMLAttributes: { loading: "lazy" },
      resize: {
        enabled: true,
        directions: ["bottom-right"],
        minWidth: 80,
        alwaysPreserveAspectRatio: true,
      },
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Placeholder.configure({ placeholder }),
  ]
}
