import { describe, expect, it } from 'vitest'
import { sanitizePostHtml } from '@/server/utils/sanitizePostHtml'

describe('sanitizePostHtml', () => {
  it('drops scripts, event handlers and javascript: URLs', () => {
    const out = sanitizePostHtml(
      '<p onclick="a()">hi <img src="x.png" onerror="alert(1)"><a href="javascript:alert(1)">l</a><script>alert(1)</script><iframe src="//e"></iframe></p>',
    )
    expect(out).toBe('<p>hi <img src="x.png" /><a>l</a></p>')
  })

  it('keeps ordinary post formatting', () => {
    const html = '<h2>T</h2><p><strong>b</strong> <a href="https://x.dev">x</a></p><pre class="lang-ts"><code class="lang-ts">1</code></pre>'
    expect(sanitizePostHtml(html)).toBe(html)
  })
})
