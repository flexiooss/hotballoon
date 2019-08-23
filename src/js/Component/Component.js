import {CoreException} from '../CoreException'

/**
 * @interface
 */
export class Component {
  /**
   * @param {Element} htmlElement
   * @return {Component}
   */
  mountView(htmlElement) {
    throw new CoreException(`mountView should be override`)
  }

  /**
   *
   */
  remove() {
    throw new CoreException(`mountView should be override`)
  }
}
