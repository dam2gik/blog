import { Trash2 } from "lucide-react"

import { getCategories } from "@/entities/post/index.server"
import { Button } from "@/shared/ui"

import { deleteCategoryAction } from "../api/manage-categories"
import { CategoryForm } from "./category-form"

export async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">카테고리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          글을 분류할 기준을 관리합니다.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-lg border bg-background">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between border-b px-4 py-3 last:border-b-0"
            >
              <div>
                <p className="text-sm font-medium">{category.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  /{category.slug}
                </p>
              </div>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${category.title} 삭제`}
                >
                  <Trash2 />
                </Button>
              </form>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              카테고리가 없습니다.
            </p>
          )}
        </div>
        <CategoryForm />
      </div>
    </div>
  )
}
