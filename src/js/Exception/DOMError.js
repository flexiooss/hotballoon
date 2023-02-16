import {HBException} from "./HBException.js";

export class DOMError extends HBException {
  /**
   * @return {string}
   */
  realName() {
    return 'DOMError';
  }
}
