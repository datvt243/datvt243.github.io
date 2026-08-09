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

const bioLines = computed(() => {
  // API wraps introduction in <p>...</p> (sometimes multiple paragraphs); strip those
  // block wrappers first so the depth-based sentence splitter below isn't gated off
  // for the whole string by one never-closing tag.
  const withoutParagraphs = (hero.value.introduction || '').replace(/<\/?p[^>]*>/gi, '')
  const sentences = splitHtmlIntoSentences(withoutParagraphs)
  return ['/**', ' * About me', ' *', ...sentences.map((s) => ` * ${s}`), ' */']
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
      <EditorCodeBlock :lines="bioLines" class="mb-4" />
    </ClientOnly>

    <ul v-if="social" class="flex gap-1 space-x-4">
      <li v-for="[name, link] in Object.entries(social)" :key="name">
        <a :href="link" target="_blank" class="text-pink">
          <UTooltip :text="link" :popper="{ placement: 'top' }">
            <UIcon
              :name="`grommet-icons:${name.toLocaleLowerCase() === 'website' ? 'globe' : name}`"
              class="w-6 h-6"
            />
          </UTooltip>
        </a>
      </li>
    </ul>

    <p class="mt-4">
      <UButton color="pink" variant="solid" size="lg" :disabled="isDisabled" @click="downloadResume()">
        Download CV
      </UButton>
    </p>
  </div>
</template>
<style scoped>
:deep(strong) {
	color: var(--color-green);
}
</style>
