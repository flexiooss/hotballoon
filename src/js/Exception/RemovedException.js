export class RemovedException extends Error {
  constructor(message = '', ...params) {
    super(...params)
    this.message = message
    this.name = this.constructor.name
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static COMPONENT(id) {
    return new RemovedException(`Component already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static STORE(id) {
    return new RemovedException(`Store already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static ACTION(id) {
    return new RemovedException(`Action already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static VIEW_CONTAINER(id) {
    return new RemovedException(`ViewContainer already registered : ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static VIEW(id) {
    return new RemovedException(`ViewContainer already registered : ${id}`)
  }


  toString() {
    return ` ${this.name} --- ${this.message} `
  }
}
