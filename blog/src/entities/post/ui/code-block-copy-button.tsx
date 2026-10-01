"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

import { Button } from "@/shared/ui/button"

export function CodeBlockCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-7 gap-1.5 px-2 text-xs text-[#aeb9c9] hover:bg-white/10 hover:text-white"
      aria-label={copied ? "코드 복사됨" : "코드 복사"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        } catch {
          setCopied(false)
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "복사됨" : "복사"}
    </Button>
  )
}
