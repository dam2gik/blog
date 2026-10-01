export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
