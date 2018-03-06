'use strict'
import {
  HBException
} from './HBException'

class CoreException extends HBException {
  constructor(message, code) {
    super(message, code)
    this._name = 'CoreException'
  }

  static codes() {
    return {
      UNKNOW: 'Unknow error',
      BAD_INHERIT_CLASS: 'Bad instance of Class'
    }
  }
}
export {
  CoreException
}
