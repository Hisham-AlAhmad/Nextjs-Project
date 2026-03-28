/**
 * Generates a URL-friendly slug from a string.
 * e.g. "Hello World!" → "hello-world"
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Checks whether TipTap HTML output contains real content
 * (not just empty paragraph tags).
 */
export function hasRichTextContent(html) {
  if (!html) return false
  return html.replace(/<[^>]*>/g, '').trim().length > 0
}
