import {assert, isString} from '@flexio-oss/js-commons-bundle/assert'

export class WithID {
  /**
   * @type {string}
   */
  #id

  /**
   * @param {String} id
   */
  constructor(id) {
    assert(isString(id) && !!id, 'hotballoon:WithID:constructor: `id` should be a string and not empty')
    this.#id = id
  }

  /**
   * @return {string}
   */
  ID() {
    return this.#id
  }
}
