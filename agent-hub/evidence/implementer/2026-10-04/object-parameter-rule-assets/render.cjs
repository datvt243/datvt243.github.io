const root = process.cwd()
const jiti = require(root + '/node_modules/jiti')(__filename, { alias: { '@': root, '~': root } })
const { pageRender } = jiti(root + '/server/utils/createPDF.ts')
const { pageRenderAts } = jiti(root + '/server/utils/createPDFAts.ts')
const fx = require('./fixtures.cjs')
const out = []
fx.forEach((r, i) => {
  try { out.push(`--classic ${i}\n` + JSON.stringify(pageRender(structuredClone(r)))) } catch (e) { out.push(`--classic ${i} THROW ${e.message}`) }
  for (const lang of ['vi', 'en']) {
    try { out.push(`--ats ${i} ${lang}\n` + JSON.stringify(pageRenderAts(structuredClone(r), lang))) } catch (e) { out.push(`--ats ${i} ${lang} THROW ${e.message}`) }
  }
})
process.stdout.write(out.join('\n') + '\n')
