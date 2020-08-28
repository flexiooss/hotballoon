import {NotOverrideException} from '@flexio-oss/js-commons-bundle/assert'

/**
 * @interface
 */
export class Component {
  remove() {
    throw NotOverrideException.FROM_INTERFACE('Hotballoon::Component')
  }

  /**
   * @return {boolean}
   */
  isRemoving() {
    throw NotOverrideException.FROM_INTERFACE('Hotballoon::Component')
  }
}
