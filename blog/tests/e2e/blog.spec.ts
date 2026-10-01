import { expect, test } from "@playwright/test"

test("renders the public blog without horizontal overflow", async ({
  page,
}) => {
  const pageErrors: Error[] = []
  const hydrationWarnings: string[] = []
  page.on("pageerror", (error) => pageErrors.push(error))
  page.on("console", (message) => {
    const text = message.text()
    if (
      /Cannot render a sync or defer|cannot be a child of <html>|hydration error|hydration failed/i.test(
        text
      )
    ) {
      hydrationWarnings.push(text)
    }
  })
  const response = await page.goto("/")

  expect(response?.ok()).toBeTruthy()
  await expect(page.getByRole("heading", { name: "글", exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "kim2gic" })).toBeVisible()
  await expect(
    page.getByRole("navigation", { name: "주요 메뉴" })
  ).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://kim2gic.kr"
  )

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
  )
  expect(hasHorizontalOverflow).toBe(false)

  await page.evaluate(() => window.dispatchEvent(new Event("keydown")))
  expect(pageErrors).toEqual([])
  expect(hydrationWarnings).toEqual([])
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
