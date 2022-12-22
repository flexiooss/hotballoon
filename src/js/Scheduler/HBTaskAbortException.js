import {BaseException} from "@flexio-oss/js-commons-bundle/js-type-helpers";

export class HBTaskAbortException extends BaseException {
  realName() {
    return 'HBTaskAbortException'
  }
}