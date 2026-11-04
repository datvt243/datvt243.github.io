/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.bodyAttrs.push('class="bg-theme-canvas text-theme-text"')
  })

  // Replaces the routeRules CSP on HTML pages, so it repeats its frame-ancestors.
  nitroApp.hooks.hook('render:response', (response) => {
    if (typeof response.body === 'string' && response.headers?.['content-type']?.includes('text/html')) {
      response.headers['content-security-policy'] = `frame-ancestors 'none'; ${scriptCsp(response.body)}`
    }
  })
})
