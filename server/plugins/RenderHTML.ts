/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyAttrs.push('class="bg-theme-canvas text-theme-text"')
  })

  // Report-Only until a release shows no violations; then rename to Content-Security-Policy.
  nitroApp.hooks.hook('render:response', (response) => {
    if (typeof response.body === 'string' && response.headers?.['content-type']?.includes('text/html')) {
      response.headers['content-security-policy-report-only'] = scriptCsp(response.body)
    }
  })
})
