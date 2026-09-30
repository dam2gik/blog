import { expect, test } from "@playwright/test"

test("renders the public blog without horizontal overflow", async ({
  page,
}) => {
  const response = await page.goto("/")

  expect(response?.ok()).toBeTruthy()
  await expect(
    page.getByRole("heading", { name: "오래 남길 생각을 씁니다." })
  ).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "주요 메뉴" })
  ).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
  )
  expect(hasHorizontalOverflow).toBe(false)
})

test("renders the administrator login page", async ({ page }) => {
  const response = await page.goto("/admin/login")

  expect(response?.ok()).toBeTruthy()
  await expect(
    page.getByRole("heading", { name: "관리자 로그인" })
  ).toBeVisible()
  await expect(page.getByLabel("이메일")).toBeVisible()
  await expect(page.getByLabel("비밀번호")).toBeVisible()
  await expect(page.getByRole("button", { name: "로그인" })).toBeEnabled()
})

test("redirects anonymous visitors away from administrator pages", async ({
  page,
}) => {
  await page.goto("/admin")

  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin$/)
  await expect(
    page.getByRole("heading", { name: "관리자 로그인" })
  ).toBeVisible()
})
