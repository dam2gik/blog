import Link from "next/link"

import { Button } from "@/shared/ui"

import { LoginForm } from "./login-form"

export function AdminLoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f6f7f9] px-5 py-10 dark:bg-background">
      <div className="w-full max-w-sm">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
        >
          ← 블로그로
        </Button>
        <div className="mt-4 rounded-xl border bg-background p-7">
          <p className="mb-6 text-lg font-bold tracking-[-0.04em]">kim2gic</p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">
            관리자 로그인
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            등록된 관리자 계정만 접근할 수 있습니다.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
