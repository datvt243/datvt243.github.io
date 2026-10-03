/**
 * ATS-optimized CV template (issue #206) — single column, system font
 * stack, no letter-spacing, standard localized section headings, no web
 * fonts/external CSS. Ported from resume-nodejs-api's
 * `services/createPDF.ats.ts` and rendered locally instead of proxied:
 * the backend's `GET /api/v1/download-pdf?template=ats` requires the
 * owner's short-lived (~1h) JWT, which a public site has no stable way to
 * hold. Sibling to `createPDF.ts` (the classic template, left unchanged).
 */
import type { Resume, GeneralInformation, ProfessionalSkill, Certificate, Award } from '@/types/resume-document'

export type AtsLang = 'vi' | 'en'

const VI_HEADINGS = {
  summary: 'Tóm tắt',
  skills: 'Kỹ năng',
  experience: 'Kinh nghiệm làm việc',
  projects: 'Dự án',
  education: 'Học vấn',
  certifications: 'Chứng chỉ',
  awards: 'Giải thưởng',
  languages: 'Ngoại ngữ',
  present: 'Hiện tại',
  other: 'Khác',
  stack: 'Công nghệ',
}
type Headings = typeof VI_HEADINGS

const HEADINGS: Record<AtsLang, Headings> = {
  vi: VI_HEADINGS,
  en: {
    summary: 'Summary',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education',
    certifications: 'Certifications',
    awards: 'Awards',
    languages: 'Languages',
    present: 'Present',
    other: 'Other',
    stack: 'Stack',
  },
}

const escapeHtml = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Rich-text descriptions come from the owner's own resume API (same trust
// model as createPDF.ts, which inserts them raw). Here they're reduced to a
// plain allow-list of tags with every attribute dropped, so inline styles/
// classes/spans can't reintroduce columns, colors or letter-spacing that
// trip ATS parsers.
const ALLOWED_TAGS = new Set(['p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'br'])
const simplifyRichText = (html: string | undefined | null): string => {
  if (!html) return ''
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(\/?)([a-z0-9]+)[^>]*>/gi, (_, slash: string, tag: string) =>
      ALLOWED_TAGS.has(tag.toLowerCase()) ? `<${slash}${tag.toLowerCase()}>` : '',
    )
}

const stripTags = (html: string | undefined | null): string => (html ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '')

const formatMonthYear = (val: number | null | undefined): string => {
  if (!val) return ''
  const date = new Date(val)
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}

const formatRange = (start: number | null | undefined, end: number | null | undefined, isCurrent: boolean, h: Headings): string => {
  const from = formatMonthYear(start)
  if (!end && !isCurrent) return from
  return `${from} – ${isCurrent ? h.present : formatMonthYear(end)}`
}

const entry = (title: string, meta: string, body = '', stack: string[] = [], stackLabel = ''): string => `
  <div class="entry">
    <p class="entry-title">${title}</p>
    ${meta ? `<p class="entry-meta">${escapeHtml(meta)}</p>` : ''}
    ${body ? `<div class="entry-body">${simplifyRichText(body)}</div>` : ''}
    ${stack.length ? `<p class="entry-stack">${escapeHtml(stackLabel)}: ${stack.map(escapeHtml).join(', ')}</p>` : ''}
  </div>`

const section = (heading: string, body: string): string =>
  body ? `<section class="section"><h2 class="heading">${escapeHtml(heading)}</h2>${body}</section>` : ''

export type AtsRecord = Partial<Omit<Resume, 'generalInformation'>> & {
  // The raw API returns this as an object or an array of one (see types/resume-api.ts).
  generalInformation?: Partial<GeneralInformation> | GeneralInformation[]
  certificates?: Certificate[]
  awards?: Award[]
}

export const pageRenderAts = (RECORD: AtsRecord, lang: AtsLang = 'vi') => {
  const h = HEADINGS[lang]
  const {
    firstName = '',
    lastName = '',
    email = '',
    phone = '',
    address = '',
    introduction = '',
    socialMedia,
    generalInformation: generalInformationRaw,
    experiences = [],
    projects = [],
    educations = [],
    certificates = [],
    awards = [],
  } = RECORD
  const { github = '', linkedin = '', website = '' } = socialMedia || {}
  const generalInformation: Partial<GeneralInformation> = Array.isArray(generalInformationRaw)
    ? generalInformationRaw[0] || {}
    : generalInformationRaw || {}
  const fullName = `${firstName} ${lastName}`.trim()
  const headline = generalInformation.positionDesired || generalInformation.career || ''

  const contact = [
    escapeHtml(address),
    phone && `<a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>`,
    email && `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
    ...[linkedin, github, website].map((url) => url && `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`),
  ]
    .filter(Boolean)
    .join(' &middot; ')

  const { professionalSkills = [], professionalSkillsGroup = [], foreignLanguages = [] } = generalInformation
  const skillLine = (label: string, list: ProfessionalSkill[]) =>
    list.length ? `<li>${escapeHtml(label)}: ${list.map((s) => escapeHtml(s.name)).join(', ')}</li>` : ''
  const skills = professionalSkillsGroup.length
    ? [
      ...professionalSkillsGroup.map((group) => skillLine(group, professionalSkills.filter((s) => s.group === group))),
      skillLine(h.other, professionalSkills.filter((s) => !s.group || !professionalSkillsGroup.includes(s.group))),
    ].join('')
    : skillLine(h.skills, professionalSkills)

  // Reverse-chronological order is what ATS parsers expect for experience.
  const experienceHtml = [...experiences]
    .sort((a, b) => b.startDate - a.startDate)
    .map((e) =>
      entry(`${escapeHtml(e.position)} — ${escapeHtml(e.company)}`, formatRange(e.startDate, e.endDate, e.isCurrent, h), e.description, e.skills, h.stack),
    )
    .join('')

  const projectHtml = projects
    .map((p) =>
      entry(
        `${escapeHtml(p.name)}${p.position ? ` — ${escapeHtml(p.position)}` : ''}`,
        formatRange(p.startDate, p.endDate, p.isWorking, h),
        p.description,
        p.technology,
        h.stack,
      ),
    )
    .join('')

  const educationHtml = educations
    .map((e) => entry(`${escapeHtml(e.major)} — ${escapeHtml(e.school)}`, formatRange(e.startDate, e.endDate, e.isCurrent, h), e.description))
    .join('')

  const certificateHtml = certificates
    .map((c) =>
      entry(
        `${escapeHtml(c.name)} — ${escapeHtml(c.organization)}`,
        formatRange(c.startDate, c.isNoExpiration ? null : c.endDate, c.isNoExpiration, h),
        c.description,
      ),
    )
    .join('')

  const awardHtml = awards
    .map((a) => entry(`${escapeHtml(a.name)} — ${escapeHtml(a.organization)}`, formatMonthYear(a.issueDate), a.description))
    .join('')

  const languageHtml = foreignLanguages.length
    ? `<ul>${foreignLanguages.map((l) => `<li>${escapeHtml(l.language)} (${escapeHtml(l.level)})</li>`).join('')}</ul>`
    : ''

  const summary = stripTags(introduction)

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fullName)} CV</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, "Liberation Sans", sans-serif; font-size: 10.5pt; line-height: 1.4; color: #000; margin: 0; }
  h1, h2, p, ul, ol, li { margin: 0 0 6pt 0; padding: 0; letter-spacing: normal; }
  .name { font-size: 20pt; font-weight: bold; }
  .headline { font-size: 12pt; margin-top: 2pt; }
  .contact { font-size: 10pt; margin-top: 4pt; }
  .section { margin-top: 12pt; }
  .heading { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1pt solid #000; padding-bottom: 2pt; }
  .entry { margin-bottom: 8pt; break-inside: avoid; }
  .entry-title { font-weight: bold; break-after: avoid; }
  .entry-meta { font-style: italic; font-size: 10pt; break-after: avoid; }
  .entry-body p, .entry-body li { margin-bottom: 3pt; }
  .entry-stack { font-size: 10pt; }
  ul, ol { padding-left: 16pt; }
  a { color: #000; text-decoration: underline; }
</style>
</head>
<body>
  <h1 class="name">${escapeHtml(fullName)}</h1>
  ${headline ? `<p class="headline">${escapeHtml(headline)}</p>` : ''}
  <p class="contact">${contact}</p>
  ${section(h.summary, summary ? `<p>${escapeHtml(summary)}</p>` : '')}
  ${section(h.skills, skills ? `<ul>${skills}</ul>` : '')}
  ${section(h.experience, experienceHtml)}
  ${section(h.projects, projectHtml)}
  ${section(h.education, educationHtml)}
  ${section(h.certifications, certificateHtml)}
  ${section(h.awards, awardHtml)}
  ${section(h.languages, languageHtml)}
</body>
</html>`

  return { email: email || 'resume', html }
}
