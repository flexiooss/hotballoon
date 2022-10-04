import {BaseException} from "@flexio-oss/js-commons-bundle/js-type-helpers";

export class HBException extends BaseException {
  /**
   * @return {string}
   */
  realName() {
    return 'HBException';
  }
}
