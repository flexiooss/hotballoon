import {BaseException} from '@flexio-oss/js-commons-bundle/js-type-helpers/index.js';

export class HBTaskAbortException extends BaseException {
  realName() {
    return 'HBTaskAbortException'
  }
}