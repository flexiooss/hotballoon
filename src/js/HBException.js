class HBException {
  constructor(message, code) {
    this._message = message || ''
    this._code = code || null
    this._name = 'HBException'
  }

  static codes() {
    return {}
  }

  getCode(code) {
    let message = ''

    if (this._code !== null && this.constructor.codes().code) {
      code = this.constructor.codes().code
      message = this.constructor.codes().message
    }
    return (code.length) ? `CODE ${code} : ${message}` : ''
  }

  toString() {
    return `${this._name} : ${this._message} | ${this.getCode(this._code)}`
  }
}

export {
  HBException
}
