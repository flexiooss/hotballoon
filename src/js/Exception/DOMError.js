import {HBException} from "./HBException.js";

export class DOMError extends HBException {

  /**
   * @return {string}
   */
  realName() {
    return 'DOMError';
  }

  /**
   * @param {Error} error
   * @return {DOMError}
   */
  static fromError(error){
    const a = new DOMError()
    a.message = `error when building nodes: ${error.name}::${error.message}`
    a.stack = `${a.realName()}:: ${error.stack ?? a.stack}`
    return a
  }
}
