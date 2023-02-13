import {HBException} from "./HBException.js";

export class ValidationError extends HBException {
  /**
   * @return {string}
   */
  realName() {
    return 'ValidationError';
  }
}
