/**
 * Returns true when a TipTap HTML string contains at least one visible character.
 * TipTap outputs '<p></p>' for an empty editor, so we strip all tags and trim.
 */
export function hasRichTextContent(html) {
  return html.replace(/<[^>]+>/g, '').trim().length > 0
}
