/* eslint-disable */
const root = process.cwd()
// Writes HEAD's blogSchemas.ts to a temp file next to the real one (so 'zod' resolves), removed in `finally`.
const headPath = root + '/server/utils/__head_blogSchemas.ts'
require('fs').writeFileSync(headPath, require('child_process').execSync('git show HEAD:server/utils/blogSchemas.ts'))
try {
globalThis.createError = (o) => Object.assign(new Error(o.statusMessage), o)
const jiti = require(root + '/node_modules/jiti')(__filename, { alias: { '@': root, '~': root } })
const now = jiti(root + '/server/utils/blogSchemas.ts'), head = jiti(root + '/server/utils/__head_blogSchemas.ts')
const run = (f) => { try { return 'OK ' + JSON.stringify(f()) } catch (e) { return `THROW ${e.statusCode} ${e.statusMessage} ${JSON.stringify(e.data)}` } }
const inputs = [{ nope: 1 }, null, 'str', { status: true, data: [], message: 'm', errors: null }, { status: 'x' }, { status: true, data: { posts: [], total: 3 } }]
let same = 0
for (const s of ['categoriesResponseSchema', 'postResponseSchema', 'paginatedPostsResponseSchema']) for (const raw of inputs) {
  const a = run(() => head.parseBlogApiResponse(head[s], raw, 'ctx')), b = run(() => now.parseBlogApiResponse({ schema: now[s], raw, context: 'ctx' }))
  if (a === b) same++; else console.log('DIFF', s, JSON.stringify(raw), '\n  head', a, '\n  now ', b)
  console.log(s.padEnd(30), JSON.stringify(raw).slice(0, 30).padEnd(32), a.slice(0, 60))
}
console.log(`identical ${same}/${3 * inputs.length}`)
} finally {
  require('fs').rmSync(headPath, { force: true })
}
