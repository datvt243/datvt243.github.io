import sanitizeHtml from 'sanitize-html'

/**
 * Post bodies are rendered with `v-html`, and the blog API's write side
 * isn't ours to vouch for: keep formatting tags, drop scripts, event
 * handlers and `javascript:` URLs before the response gets cached.
 */
export const sanitizePostHtml = (html: string): string =>
  sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'h1', 'h2'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      code: ['class'],
      pre: ['class'],
    },
  })
