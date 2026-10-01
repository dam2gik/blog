import type { ReactNode } from "react"

import {
  codeHighlighter,
  getCodeLanguage,
  getCodeLanguageLabel,
} from "../lib/code-languages"
import { CodeBlockCopyButton } from "./code-block-copy-button"

type HighlightedNode = ReturnType<typeof codeHighlighter.highlight>["children"][number]

function renderHighlightedNode(node: HighlightedNode, key: number): ReactNode {
  if (node.type === "text") return node.value
  if (node.type !== "element") return null

  const className = node.properties.className

  return (
    <span key={key} className={Array.isArray(className) ? className.join(" ") : undefined}>
      {node.children.map(renderHighlightedNode)}
    </span>
  )
}

export function CodeBlock({
  code,
  language: rawLanguage,
}: {
  code: string
  language: unknown
}) {
  const language = getCodeLanguage(rawLanguage)
  const highlighted = codeHighlighter.highlight(language, code)

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{getCodeLanguageLabel(language)}</span>
        <CodeBlockCopyButton code={code} />
      </div>
      <pre>
        <code className={`language-${language}`}>
          {highlighted.children.map(renderHighlightedNode)}
        </code>
      </pre>
    </div>
  )
}
