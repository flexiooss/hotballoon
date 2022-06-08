import {HBException} from "./HBException";

export class DOMError extends HBException {
  /**
   * @return {string}
   */
  realName() {
    return 'DOMError';
  }
}
