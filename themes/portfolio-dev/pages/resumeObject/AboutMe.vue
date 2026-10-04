<script setup lang="ts">
/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

const { t, locale } = useI18n()
const store = useResumeStore()
const hero = computed(() => store.hero)
const social = computed(() => store.social)

const { downloadResume, isDisabled, isLoading } = useDownloadResume()

/**
 * Splits an HTML string into "sentences" only at points where no tag is
 * currently open, so inline markup (e.g. <strong>) never gets broken across lines.
 */
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

/**
 * Renders a sentence as literal Markdown source: <strong>/<b> becomes visible **bold** syntax instead of
 * actually-rendered bold HTML, with a dimmed "**" around bold text (Markdown syntax-highlighting look).
 */
function toMarkdownLine(sentenceHtml: string): string {
  /**
   * Drop every tag except <strong>/<b>, then split on those tags - the split naturally alternates [plain,
   * bold, plain, bold, ...] since each strong/b pair produces one boundary pair, so no marker characters are
   * needed.
   */
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

/**
 * `[text](url)` Markdown link syntax, still a real <a> (works fine via v-html,
 * no Vue binding needed for plain navigation) so it stays clickable.
 */
function markdownLink(text: string, url: string) {
  return (
    `<span class="text-theme-faint">[</span>` +
    `<a href="${escapeHtml(url)}" target="_blank" class="text-theme-code-keyword hover:underline">${escapeHtml(text)}</a>` +
    `<span class="text-theme-faint">](</span><span class="text-theme-accent-soft">${escapeHtml(url)}</span><span class="text-theme-faint">)</span>`
  )
}

/**
 * CV download rendered as one more Markdown link line instead of a separate
 * button. The <a> keeps a real href (plain navigation still works without
 * JS), but clicks are intercepted by onBioClick below so the normal
 * downloadResume() flow (toast, loading/disabled state) runs. While loading
 * or after a failure it renders as plain, non-clickable text.
 */
const DOWNLOAD_ICON =
  '<svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'

function downloadCvLine() {
  const url = `/api/generate-pdf?lang=${locale.value}`
  const label = isLoading.value ? t('resume.downloadingCv') : t('resume.downloadCv')
  const text =
    isLoading.value || isDisabled.value
      ? `<span class="text-theme-muted">${DOWNLOAD_ICON}${escapeHtml(label)}</span>`
      : `<a href="${escapeHtml(url)}" data-download-cv class="text-theme-code-keyword hover:underline">${DOWNLOAD_ICON}${escapeHtml(label)}</a>`
  return (
    `<span class="text-theme-faint">[</span>${text}` +
    `<span class="text-theme-faint">](</span><span class="text-theme-accent-soft">${escapeHtml(url)}</span><span class="text-theme-faint">)</span>`
  )
}

function onBioClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (!target?.closest('[data-download-cv]')) return
  event.preventDefault()
  downloadResume()
}

const bioLines = computed(() => {
  /**
   * API wraps introduction in <p>...</p> (sometimes multiple paragraphs); strip those
   * block wrappers first so the depth-based sentence splitter below isn't gated off
   * for the whole string by one never-closing tag.
   */
  const withoutParagraphs = hero.value.introduction.replace(/<\/?p[^>]*>/gi, '')
  const sentences = splitHtmlIntoSentences(withoutParagraphs).map(toMarkdownLine)
  const socialLines = social.value.links.map(({ name, url }) => markdownLink(name, url))
  return [
    `<span class="text-theme-faint"># </span><span class="font-bold text-theme-text">${escapeHtml(t('resume.aboutMeHeading'))}</span>`,
    '',
    ...sentences,
    '',
    ...socialLines,
    '',
    downloadCvLine(),
  ]
})

</script>

<template>
  <div @click="onBioClick">
    <ThemeCodeBlock :lines="bioLines" class="mb-4" />
  </div>
</template>
