import {CLASS_TAG_NAME, CLASS_TAG_NAME_SERVICE} from '../Types/HasTagClassNameInterface'


/**
 * @interface
 * @implements  {HasTagClassNameInterface}
 */
export class HotballoonService {
  constructor() {
    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_SERVICE
    })
  }

  /**
   * @return {string}
   */
  name() {
    throw new Error('should be override')
  }

  remove() {
    throw new Error('should be override')
  }
}
