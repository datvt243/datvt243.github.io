import { cloneDeep } from '@/utils'

/**
 * Prototype pattern base: `clone()` re-attaches the same prototype via
 * `Object.create` (so subclass getters/methods survive the clone, unlike a
 * plain-object copy) and deep-copies the instance's own data fields onto it.
 * Class methods/getters live on the prototype and are non-enumerable, so
 * `cloneDeep`'s `for...in` walk never touches them - only real data fields
 * get copied.
 */
export abstract class BaseModel {
  clone(): this {
    const copy = Object.create(Object.getPrototypeOf(this))
    return Object.assign(copy, cloneDeep(this))
  }
}
