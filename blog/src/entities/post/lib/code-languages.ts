import bash from "highlight.js/lib/languages/bash"
import css from "highlight.js/lib/languages/css"
import go from "highlight.js/lib/languages/go"
import java from "highlight.js/lib/languages/java"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import plaintext from "highlight.js/lib/languages/plaintext"
import python from "highlight.js/lib/languages/python"
import sql from "highlight.js/lib/languages/sql"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import { createLowlight } from "lowlight"

export const CODE_LANGUAGES = [
  { value: "plaintext", label: "일반 텍스트" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "HTML / XML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash" },
] as const

const aliases: Record<string, string> = {
  html: "xml",
  js: "javascript",
  py: "python",
  sh: "bash",
  text: "plaintext",
  ts: "typescript",
}

export const codeHighlighter = createLowlight({
  bash,
  css,
  go,
  java,
  javascript,
  json,
  plaintext,
  python,
  sql,
  typescript,
  xml,
})

export function getCodeLanguage(value: unknown) {
  if (typeof value !== "string") return "plaintext"
  const language = aliases[value.toLowerCase()] ?? value.toLowerCase()
  return CODE_LANGUAGES.some((item) => item.value === language)
    ? language
    : "plaintext"
}

export function getCodeLanguageLabel(value: unknown) {
  const language = getCodeLanguage(value)
  return (
    CODE_LANGUAGES.find((item) => item.value === language)?.label ??
    "일반 텍스트"
  )
}
