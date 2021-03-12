export class AlreadyRegisteredException extends Error {
  constructor(message = '', ...params) {
    super(...params)
    this.message = message
    this.name = this.constructor.name
  }

  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static COMPONENT(id) {
    return new AlreadyRegisteredException(`Component already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static STORE(id) {
    return new AlreadyRegisteredException(`Store already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static ACTION(id) {
    return new AlreadyRegisteredException(`Action already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static VIEW_CONTAINER(id) {
    return new AlreadyRegisteredException(`ViewContainer already registered : ${id}`)
  }


  toString() {
    return ` ${this.name} --- ${this.message} `
  }
}
