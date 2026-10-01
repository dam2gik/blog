"use client"

import {
  FilePenLine,
  Files,
  FolderTree,
  Images,
  LayoutDashboard,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/shared/ui"

const navigation = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/posts", label: "글 관리", icon: Files },
  { href: "/admin/posts/new", label: "글 작성", icon: FilePenLine },
  { href: "/admin/categories", label: "카테고리", icon: FolderTree },
  { href: "/admin/assets", label: "에셋 관리", icon: Images },
] as const

function isCurrentPath(pathname: string, href: string) {
  if (href === "/admin") return pathname === href
  if (href === "/admin/posts") {
    return pathname === href || /^\/admin\/posts\/\d+\/edit$/.test(pathname)
  }
  return pathname === href
}

export function AdminNavigation() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1" aria-label="관리자 메뉴">
      {navigation.map((item) => {
        const active = isCurrentPath(pathname, item.href)

        return (
          <Button
            key={item.href}
            variant="ghost"
            className={`h-10 w-full justify-start gap-3 px-3 ${
              active
                ? "bg-muted font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
            nativeButton={false}
            render={
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
              />
            }
          >
            <item.icon className={active ? "text-brand" : undefined} />
            {item.label}
          </Button>
        )
      })}
    </nav>
  )
}
