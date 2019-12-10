import {CoreException} from '../CoreException'

/**
 * @interface
 */
export class Component {

  /**
   *
   */
  remove() {
    throw new CoreException(`mountView should be override`)
  }
}
