import {
  FilePenLine,
  Files,
  FolderTree,
  Home,
  LogOut,
  Menu,
  PanelLeft,
} from "lucide-react"
import Link from "next/link"

import { logoutAction, requireAdmin } from "@/shared/auth"
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui"

const navigation = [
  { href: "/admin", label: "대시보드", icon: PanelLeft },
  { href: "/admin/posts", label: "글 관리", icon: Files },
  { href: "/admin/posts/new", label: "글 작성", icon: FilePenLine },
  { href: "/admin/categories", label: "카테고리", icon: FolderTree },
] as const

function AdminNavigation() {
  return (
    <nav className="space-y-1" aria-label="관리자 메뉴">
      {navigation.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className="w-full justify-start"
          nativeButton={false}
          render={<Link href={item.href} />}
        >
          <item.icon />
          {item.label}
        </Button>
      ))}
    </nav>
  )
}

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-dvh bg-muted/30">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-14 items-center px-4 text-sm font-semibold">
          블로그 관리
        </div>
        <Separator />
        <div className="flex-1 p-3">
          <AdminNavigation />
        </div>
        <div className="space-y-1 border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <Home />
            블로그 보기
          </Button>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start"
            >
              <LogOut />
              로그아웃
            </Button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-56">
        <header className="flex h-14 items-center gap-3 border-b bg-background px-4 lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="관리자 메뉴 열기"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-3">
              <SheetTitle className="px-2 py-3 text-left text-sm">
                블로그 관리
              </SheetTitle>
              <AdminNavigation />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">블로그 관리</span>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
