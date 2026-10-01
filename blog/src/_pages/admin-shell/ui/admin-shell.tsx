import { Home, LogOut, Menu } from "lucide-react"
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

import { AdminNavigation } from "./admin-navigation"

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-dvh bg-[#f6f7f9] dark:bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-background lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 px-5">
          <Link href="/admin" className="text-lg font-bold tracking-[-0.04em]">
            kim2gic
          </Link>
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            관리
          </span>
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

      <div className="lg:pl-60">
        <header className="flex h-16 items-center gap-3 border-b bg-background px-4 lg:hidden">
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
            <SheetContent side="left" className="w-72 p-3">
              <SheetTitle className="px-2 py-4 text-left text-lg font-bold tracking-[-0.04em]">
                kim2gic
              </SheetTitle>
              <AdminNavigation />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">관리자</span>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
