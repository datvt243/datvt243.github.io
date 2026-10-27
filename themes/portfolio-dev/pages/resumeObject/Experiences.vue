<script setup lang="ts">
/**
 * @file Renders each job as real semantic HTML (article/h2/p/time/ul/li) styled
 * to look like a Pug source listing (indentation only, tag.class
 * shorthand, no closing tags). The visible "tag"/".class" glyphs are
 * decorative aria-hidden spans before the real text, and line numbers
 * come from a CSS counter (not literal text) — so a screen reader still
 * hears "heading: Frontend Developer", "list, 6 items", etc. instead of
 * literal punctuation.
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

const { resumeContentLang } = useAppConfig()
const { t, te } = useI18n()
const store = useResumeStore()
const experiences = computed(() => store.experiences)

/** "Career break — Travel"; an empty/unknown type falls back to just "Career break". */
function careerBreakTitle(type: string) {
  const key = `resume.careerBreakTypes.${type}`
  return type && te(key) ? `${t('resume.careerBreak')} — ${t(key)}` : t('resume.careerBreak')
}

const tagName = (s: string) => `<span class="tag-name">${s}</span>`
const className = (s: string) => `<span class="class-name">.${s}</span>`
function pugTag(name: string, cls?: string) {
  return `${tagName(name)}${cls ? className(cls) : ''}`
}
</script>

<template>
  <div class="code-lines font-theme-mono text-sm leading-relaxed">
    <template v-for="(el, index) in experiences" :key="el.id || index">
      <div v-if="index > 0" class="code-line" aria-hidden="true"><span class="line-content">&nbsp;</span></div>
      <div v-if="index > 0" class="code-line comment" aria-hidden="true">
        <span class="line-content">// next experience</span>
      </div>

      <article class="experience">
        <div class="code-line" aria-hidden="true"><span class="line-content" v-html="pugTag('article', 'experience')" /></div>

        <h2 class="code-line depth-1 position">
          <span v-if="el.isCareerBreak" class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('h2', 'career-break')" /><span class="tag-text">{{ careerBreakTitle(el.careerBreakType) }}</span></span>
          <span v-else class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('h2', 'position')" /><span class="tag-text">{{ el.position }}</span></span>
        </h2>
        <p v-if="!el.isCareerBreak" class="code-line depth-1">
          <span class="line-content tagged"
          ><span aria-hidden="true" class="tag-label" v-html="pugTag('p', 'company')" /><span class="tag-text">{{ el.company }}</span></span
          >
        </p>
        <time class="code-line depth-1 period">
          <span class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('time', 'period')" /><span class="tag-text">{{ el.dateRangeLabel }}</span></span>
        </time>

        <template v-if="el.descriptionItems.length">
          <div class="code-line depth-1" aria-hidden="true"><span class="line-content" v-html="pugTag('ul', 'description')" /></div>
          <ul :lang="resumeContentLang">
            <li v-for="(point, i) in el.descriptionItems" :key="i" class="code-line depth-2">
              <span class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('li')" /><span class="tag-text">{{ point }}</span></span>
            </li>
          </ul>
        </template>

        <!-- Skills are one-word items: one comma-separated line, not one line per li. -->
        <p v-if="el.skills?.length" class="code-line depth-1">
          <span class="line-content tagged"
          ><span aria-hidden="true" class="tag-label" v-html="pugTag('p', 'skills')" /><span class="tag-text">{{ el.skills.join(', ') }}</span></span
          >
        </p>
      </article>
    </template>
  </div>
</template>

<style scoped lang="scss">
.code-lines {
  counter-reset: line;
}

.code-line {
  counter-increment: line;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin: 0;
  font-weight: 400;
  color: rgb(var(--theme-code-text));
  list-style: none;
}

.code-line::before {
  content: counter(line);
  color: rgb(var(--theme-code-line-number));
  width: 1.5rem;
  text-align: right;
  flex-shrink: 0;
  user-select: none;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
}

.line-content {
  min-width: 0;
}

.tagged {
  display: flex;
  align-items: baseline;
  gap: 1ch;
}
.tag-label {
  flex-shrink: 0;
}
.tag-text {
  min-width: 0;
}

.depth-1 .line-content {
  padding-left: 2ch;
}
.depth-2 .line-content {
  padding-left: 4ch;
}

/**
 * Only the heading text is enlarged - sizing the whole line would also
 * scale its `ch`-based indent and push the `h2` glyph right of its
 * siblings (`p`, `time`).
 */
.position {
  font-size: inherit;
}
.position .tag-text {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--theme-code-title));
}

.comment {
  color: rgb(var(--theme-code-comment));
  font-style: italic;
}

:deep(.tag-name) {
  color: rgb(var(--theme-code-tag));
}
:deep(.class-name) {
  color: rgb(var(--theme-code-type));
}

ul {
  margin: 0;
  padding: 0;
}

/**
 * On a phone the gutter, tag labels and indents left the text about half
 * the screen. They are decoration, so they go first; list items get a plain
 * "- " marker instead so they don't run together, and the "// next
 * experience" comment stays as the separator between jobs.
 */
@media (width < 48rem) {
  .code-line::before,
  .tag-label,
  .code-line[aria-hidden='true']:not(.comment) {
    display: none;
  }
  .depth-1 .line-content {
    padding-left: 0;
  }
  /* Hanging indent: wrapped lines align under the text, not the marker. */
  .depth-2 .line-content {
    padding-left: 2ch;
    text-indent: -2ch;
  }
  .depth-2 .tag-text::before {
    content: '- ';
    color: rgb(var(--theme-muted));
  }
  .comment {
    margin-top: 1rem;
  }
}
</style>
