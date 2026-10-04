/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

export function removeHtmlTags(input: string): string {
  if (typeof input !== 'string') return ''
  return input.replace(/<\/?[^>]+(>|$)/g, '')
}
