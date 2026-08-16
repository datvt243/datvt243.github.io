<script setup lang="ts">
/**
 * Author: Đạt Võ - https://github.com/datvt243
 * Date: `--/--`
 * Description:
 *
 * Renders each job as real semantic HTML (article/h3/p/time/ul/li) styled
 * to look like a Pug source listing (indentation only, tag.class
 * shorthand, no closing tags). The visible "tag"/".class" glyphs are
 * decorative aria-hidden spans before the real text, and line numbers
 * come from a CSS counter (not literal text) — so a screen reader still
 * hears "heading: Frontend Developer", "list, 6 items", etc. instead of
 * literal punctuation.
 */

import { convertNumberToDate, extractListItems } from '@/utils/index'

const store = useResumeStore()
const experiences = computed(() => store.experiences)

function dateRange(el: { startDate: number; endDate: number; isCurrent: boolean }) {
  return `${convertNumberToDate(el.startDate)} - ${el.isCurrent ? 'present' : convertNumberToDate(el.endDate)}`
}

const tagName = (s: string) => `<span class="tag-name">${s}</span>`
const className = (s: string) => `<span class="class-name">.${s}</span>`
function pugTag(name: string, cls?: string) {
  return `${tagName(name)}${cls ? className(cls) : ''}`
}
</script>

<template>
  <div class="code-lines font-theme-mono text-sm leading-relaxed">
    <template v-for="(el, index) in experiences" :key="el._id || index">
      <div v-if="index > 0" class="code-line" aria-hidden="true"><span class="line-content">&nbsp;</span></div>
      <div v-if="index > 0" class="code-line comment" aria-hidden="true">
        <span class="line-content">// next experience</span>
      </div>

      <article>
        <div class="code-line" aria-hidden="true"><span class="line-content" v-html="pugTag('article')" /></div>

        <h3 class="code-line depth-1 title">
          <span class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('h3')" /><span class="tag-text">{{ el.position }}</span></span>
        </h3>
        <p class="code-line depth-1">
          <span class="line-content tagged"
          ><span aria-hidden="true" class="tag-label" v-html="pugTag('p', 'company')" /><span class="tag-text">{{ el.company }}</span></span
          >
        </p>
        <time class="code-line depth-1">
          <span class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('time')" /><span class="tag-text">{{ dateRange(el) }}</span></span>
        </time>

        <template v-if="el.skills?.length">
          <div class="code-line depth-1" aria-hidden="true"><span class="line-content" v-html="pugTag('ul', 'skills')" /></div>
          <ul>
            <li v-for="skill in el.skills" :key="skill" class="code-line depth-2">
              <span class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('li')" /><span class="tag-text">{{ skill }}</span></span>
            </li>
          </ul>
        </template>

        <template v-if="extractListItems(el.description).length">
          <div class="code-line depth-1" aria-hidden="true"><span class="line-content" v-html="pugTag('ul', 'description')" /></div>
          <ul>
            <li v-for="(point, i) in extractListItems(el.description)" :key="i" class="code-line depth-2">
              <span class="line-content tagged"><span aria-hidden="true" class="tag-label" v-html="pugTag('li')" /><span class="tag-text">{{ point }}</span></span>
            </li>
          </ul>
        </template>
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

.title {
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
</style>
