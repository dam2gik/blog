import Link from "next/link"

import { siteConfig } from "@/shared/config"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-10 text-xs text-muted-foreground sm:px-10">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            배우고, 만들고, 기록합니다.
          </p>
          <p>
            © {new Date().getFullYear()} {siteConfig.author}
          </p>
        </div>
        <div className="flex gap-5">
          <Link
            href="/feed.xml"
            className="inline-flex min-h-11 items-center hover:text-foreground"
          >
            RSS
          </Link>
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center hover:text-foreground"
          >
            관리
          </Link>
        </div>
      </div>
    </footer>
  )
}
