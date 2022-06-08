import {HBException} from "./HBException";

export class ValidationError extends HBException {
  /**
   * @return {string}
   */
  realName() {
    return 'ValidationError';
  }
}
