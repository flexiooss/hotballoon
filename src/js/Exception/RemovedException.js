import {HBException} from "./HBException.js";

export class RemovedException extends HBException {
  /**
   * @param {?string|function():string} [message=null]
   * @param {?number} [code=null]
   * @param params
   */
  constructor(message = null, code = null, ...params) {
    super(message + ' already removed', code, ...params)
  }

  /**
   * @return {string}
   */
  realName() {
    return 'RemovedException';
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static COMPONENT(id) {
    return new RemovedException(`Component: ${id}`)
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static STORE(id) {
    return new RemovedException(`Store: ${id}`)
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static ACTION(id) {
    return new RemovedException(`Action: ${id}`)
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static VIEW_CONTAINER(id) {
    return new RemovedException(`ViewContainer: ${id}`)
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static VIEW(id) {
    return new RemovedException(`ViewContainer: ${id}`)
  }
}
