"use client"

import { Loader2 } from "lucide-react"
import { useActionState } from "react"

import { Button, Input, Label } from "@/shared/ui"

import {
  createCategoryAction,
  type CategoryState,
} from "../api/manage-categories"

const initialState: CategoryState = {}

export function CategoryForm() {
  const [state, formAction, pending] = useActionState(
    createCategoryAction,
    initialState
  )

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border bg-background p-4"
    >
      <h2 className="text-sm font-semibold">카테고리 추가</h2>
      <div className="space-y-2">
        <Label htmlFor="title">이름</Label>
        <Input id="title" name="title" maxLength={40} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">주소</Label>
        <Input id="slug" name="slug" placeholder="비워두면 이름에서 생성" />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-emerald-700">
          카테고리를 추가했습니다.
        </p>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}추가
      </Button>
    </form>
  )
}
