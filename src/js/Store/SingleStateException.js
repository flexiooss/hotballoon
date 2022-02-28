export class SingleStateException extends Error {
  constructor(message = '', ...params) {
    super(...params)
    this.message = message
    this.name = this.constructor.name
  }

  /**
   * @param {string} name
   * @return {SingleStateException}
   */
  static FROM(name) {
    return new SingleStateException(`Store ${name} is single state`)
  }


  toString() {
    return ` ${this.name} --- ${this.message} `
  }
}
