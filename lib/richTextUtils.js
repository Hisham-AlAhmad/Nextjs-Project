/**
 * Converts any HTML-ish input to plain text.
 * This guarantees we never persist HTML tags in the database.
 */
export function toPlainText(input) {
  if (input === null || input === undefined) return ''

  return String(input)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function hasTextContent(input) {
  return toPlainText(input).length > 0
}
