import {HBException} from "./HBException.js";

export class UnexpectedError extends HBException {
  /**
   * @param {?string|function():string} [message=null]
   */
  constructor(message = null) {
    super(message, 500)
  }

  /**
   * @return {string}
   */
  realName() {
    return 'UnexpectedError';
  }
}
