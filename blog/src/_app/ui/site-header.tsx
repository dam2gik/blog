import Link from "next/link"

import { siteConfig } from "@/shared/config"
import { Button } from "@/shared/ui"

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-[-0.045em] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
