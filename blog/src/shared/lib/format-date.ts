const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export function formatDate(value: string | Date) {
  return dateFormatter.format(new Date(value))
}
