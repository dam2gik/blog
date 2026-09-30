import Link from "next/link"

import { siteConfig } from "@/shared/config"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {siteConfig.author}
        </p>
        <div className="flex gap-4">
          <Link href="/feed.xml" className="hover:text-foreground">
            RSS
          </Link>
          <Link href="/admin" className="hover:text-foreground">
            관리
          </Link>
        </div>
      </div>
    </footer>
  )
}
