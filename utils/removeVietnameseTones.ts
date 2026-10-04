/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

/**
 * Strips Vietnamese diacritics ("Tân Bình, Hồ Chí Minh" → "Tan Binh, Ho Chi Minh").
 * NFD splits accented letters into base + combining marks, which are then
 * dropped; đ/Đ are separate letters (not base + mark), so they're mapped by hand.
 */
export function removeVietnameseTones(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}
