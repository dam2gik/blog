import Link from "next/link"

import { siteConfig } from "@/shared/config"
import { Button } from "@/shared/ui"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="border-b bg-background/95">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        본문으로 건너뛰기
      </a>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="text-2xl font-bold tracking-[-0.065em] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {siteConfig.name}
        </Link>
        <nav
          className="flex items-center gap-1 sm:gap-3"
          aria-label="주요 메뉴"
        >
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/" />}
          >
            글
          </Button>
          <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            GitHub
          </Button>
        </nav>
      </div>
    </header>
  )
}
