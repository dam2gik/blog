import { lookup } from "node:dns/promises"
import { isIP } from "node:net"

import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/shared/api/supabase/index.server"

export const runtime = "nodejs"

const MAX_REDIRECTS = 3
const MAX_HTML_SIZE = 1_000_000

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase()

  if (normalized === "::1" || normalized === "::") return true
  if (
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  ) {
    return true
  }

  const ipv4 = normalized.replace(/^::ffff:/, "")
  const parts = ipv4.split(".").map(Number)
  if (parts.length !== 4 || parts.some(Number.isNaN)) return false

  return (
    parts[0] === 0 ||
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    parts[0] >= 224
  )
}

async function assertSafeUrl(value: string) {
  const url = new URL(value)
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("허용되지 않는 URL입니다.")
  }

  const hostname = url.hostname.toLowerCase()
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("내부 주소는 사용할 수 없습니다.")
  }

  const addresses = isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true })

  if (
    !addresses.length ||
    addresses.some(({ address }) => isPrivateAddress(address))
  ) {
    throw new Error("내부 주소는 사용할 수 없습니다.")
  }

  return url
}

async function fetchHtml(initialUrl: URL) {
  let currentUrl = initialUrl

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(5_000),
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "kim2gic-link-preview/1.0",
      },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location || redirectCount === MAX_REDIRECTS) {
        throw new Error("리디렉션이 너무 많습니다.")
      }
      currentUrl = await assertSafeUrl(new URL(location, currentUrl).href)
      continue
    }

    if (!response.ok) throw new Error("링크를 불러오지 못했습니다.")
    if (!response.headers.get("content-type")?.includes("text/html")) {
      throw new Error("HTML 문서가 아닙니다.")
    }

    const declaredSize = Number(response.headers.get("content-length") || 0)
    if (declaredSize > MAX_HTML_SIZE) throw new Error("문서가 너무 큽니다.")

    const html = (await response.text()).slice(0, MAX_HTML_SIZE)
    return { html, finalUrl: currentUrl }
  }

  throw new Error("링크를 불러오지 못했습니다.")
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/\s+/g, " ")
    .trim()
}

function getAttribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))
  return match?.[1]
}

function getMeta(html: string, keys: string[]) {
  for (const tag of html.match(/<meta\s+[^>]*>/gi) ?? []) {
    const key = getAttribute(tag, "property") ?? getAttribute(tag, "name")
    if (key && keys.includes(key.toLowerCase())) {
      const content = getAttribute(tag, "content")
      if (content) return decodeHtml(content)
    }
  }
  return ""
}

function parsePreview(html: string, url: URL) {
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""
  const image = getMeta(html, ["og:image", "twitter:image"])

  return {
    title:
      getMeta(html, ["og:title", "twitter:title"]) ||
      decodeHtml(titleTag) ||
      url.hostname,
    description: getMeta(html, [
      "og:description",
      "twitter:description",
      "description",
    ]).slice(0, 240),
    image: image ? new URL(image, url).href : "",
    siteName:
      getMeta(html, ["og:site_name"]) || url.hostname.replace(/^www\./, ""),
  }
}

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_blog_admin")
  if (adminError || !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const value = new URL(request.url).searchParams.get("url")
  if (!value) {
    return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 })
  }

  try {
    const safeUrl = await assertSafeUrl(value)
    const { html, finalUrl } = await fetchHtml(safeUrl)
    return NextResponse.json(parsePreview(html, finalUrl), {
      headers: { "Cache-Control": "private, max-age=3600" },
    })
  } catch (error) {
    console.error("Failed to create link preview", error)
    return NextResponse.json(
      { error: "링크 미리보기를 불러오지 못했습니다." },
      { status: 422 }
    )
  }
}
