import { Code2 } from "lucide-react"
import Link from "next/link"

import { siteConfig } from "@/shared/config"
import { Button } from "@/shared/ui"

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.02em] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-1" aria-label="주요 메뉴">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            글
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="GitHub 방문"
            nativeButton={false}
            render={
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <Code2 />
          </Button>
        </nav>
      </div>
    </header>
  )
}
