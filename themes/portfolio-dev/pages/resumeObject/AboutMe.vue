<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 */

const store = useResumeStore()
const hero = computed(() => store.hero)
const social = computed(() => store.social)

const isDisabled = ref(false)

// Splits an HTML string into "sentences" only at points where no tag is
// currently open, so inline markup (e.g. <strong>) never gets broken across lines.
function splitHtmlIntoSentences(html: string): string[] {
  const parts: string[] = []
  let depth = 0
  let buffer = ''
  let i = 0
  while (i < html.length) {
    if (html[i] === '<') {
      const closeIdx = html.indexOf('>', i)
      if (closeIdx === -1) {
        buffer += html.slice(i)
        break
      }
      const tag = html.slice(i, closeIdx + 1)
      if (/^<\//.test(tag)) depth--
      else if (!/\/>$/.test(tag)) depth++
      buffer += tag
      i = closeIdx + 1
      continue
    }
    buffer += html[i]
    if (depth === 0 && html[i] === '.' && (html[i + 1] === ' ' || i + 1 === html.length)) {
      parts.push(buffer.trim())
      buffer = ''
    }
    i++
  }
  if (buffer.trim()) parts.push(buffer.trim())
  return parts
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Renders a sentence as literal Markdown source: <strong>/<b> becomes visible
// **bold** syntax instead of actually-rendered bold HTML. A private-use
// marker keeps the bold boundaries intact through HTML-escaping, then gets
// swapped for a dimmed "**" + bold text (Markdown syntax-highlighting look).
function toMarkdownLine(sentenceHtml: string): string {
  // Drop every tag except <strong>/<b>, then split ON those tags — String.split
  // with a non-capturing... actually a matching regex naturally alternates
  // [plain, bold, plain, bold, ...] since each strong/b pair produces one
  // split boundary pair, with no marker characters needed.
  const withoutOtherTags = sentenceHtml.replace(/<(?!\/?(?:strong|b)\b)[^>]+>/gi, '')
  const parts = withoutOtherTags.split(/<\/?(?:strong|b)>/gi)
  return parts
    .map((chunk, i) =>
      i % 2 === 1
        ? `<span class="text-theme-faint">**</span><span class="font-bold text-theme-text">${escapeHtml(chunk)}</span><span class="text-theme-faint">**</span>`
        : escapeHtml(chunk),
    )
    .join('')
}

// `[text](url)` Markdown link syntax, still a real <a> (works fine via v-html,
// no Vue binding needed for plain navigation) so it stays clickable.
function markdownLink(text: string, url: string) {
  return (
    `<span class="text-theme-faint">[</span>` +
    `<a href="${escapeHtml(url)}" target="_blank" class="text-blue-400 hover:underline">${escapeHtml(text)}</a>` +
    `<span class="text-theme-faint">](</span><span class="text-theme-accent-soft">${escapeHtml(url)}</span><span class="text-theme-faint">)</span>`
  )
}

const bioLines = computed(() => {
  // API wraps introduction in <p>...</p> (sometimes multiple paragraphs); strip those
  // block wrappers first so the depth-based sentence splitter below isn't gated off
  // for the whole string by one never-closing tag.
  const withoutParagraphs = hero.value.introduction.replace(/<\/?p[^>]*>/gi, '')
  const sentences = splitHtmlIntoSentences(withoutParagraphs).map(toMarkdownLine)
  const socialLines = social.value.links.map(({ name, url }) => markdownLink(name, url))
  return [
    '<span class="text-theme-faint"># </span><span class="font-bold text-theme-text">About me</span>',
    '',
    ...sentences,
    '',
    ...socialLines,
  ]
})

async function downloadResume() {
  const response = await fetch('/api/generate-pdf')

  const { status } = response
  if (status !== 200) {
    isDisabled.value = true
    return
  }

  const blob = await response.blob()
  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = `${hero.value.email || 'download'}.pdf`
  link.click()
}
</script>

<template>
  <div>
    <ClientOnly>
      <!-- v-html chỉ chạy ở client, server ko render ra đc -> tạm thời xài clientOnly -->
      <ThemeCodeBlock :lines="bioLines" class="mb-4" />
    </ClientOnly>

    <button
      type="button"
      class="font-theme-mono text-sm mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
      :disabled="isDisabled"
      @click="downloadResume()"
    >
      <span class="text-theme-faint">[</span><span class="text-blue-400 hover:underline">Download CV</span
      ><span class="text-theme-faint">](</span><span class="text-theme-accent-soft">./resume.pdf</span><span class="text-theme-faint">)</span>
    </button>
  </div>
</template>
