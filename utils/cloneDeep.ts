/**
 * @author Đạt Võ <votan.it@gmail.com>
 * @see https://github.com/datvt243
 */

/**
 * @param obj - value to deep clone (objects and arrays are copied recursively; other values are returned as-is)
 * @returns Object | Array | string ...
 * */
export function cloneDeep<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  const copy = (Array.isArray(obj) ? [] : {}) as T

  for (const key in obj) {
    copy[key] = cloneDeep(obj[key])
  }

  return copy
}
