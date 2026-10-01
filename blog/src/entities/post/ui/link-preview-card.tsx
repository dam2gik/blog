interface LinkPreviewCardProps {
  url: string
  title?: string | null
  description?: string | null
  image?: string | null
  siteName?: string | null
  loading?: boolean
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function LinkPreviewCard({
  url,
  title,
  description,
  image,
  siteName,
  loading = false,
}: LinkPreviewCardProps) {
  const hostname = getHostname(url)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="link-preview-card"
      aria-label={`${title || hostname} 링크 열기`}
    >
      <span className="link-preview-copy">
        <span className="link-preview-site">{siteName || hostname}</span>
        <span className="link-preview-title">
          {loading ? "링크 정보를 불러오는 중..." : title || url}
        </span>
        {description ? (
          <span className="link-preview-description">{description}</span>
        ) : null}
        <span className="link-preview-url">{hostname}</span>
      </span>
      {image ? (
        <span className="link-preview-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" loading="lazy" />
        </span>
      ) : null}
    </a>
  )
}
