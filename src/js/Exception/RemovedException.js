export class RemovedException extends Error {
  constructor(message = '', ...params) {
    super(...params)
    this.message = 'RemovedException::'+message+' already removed '
    this.name = this.constructor.name
  }

  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static COMPONENT(id) {
    return new RemovedException(`Component: ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static STORE(id) {
    return new RemovedException(`Store: ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static ACTION(id) {
    return new RemovedException(`Action: ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static VIEW_CONTAINER(id) {
    return new RemovedException(`ViewContainer: ${id}`)
  }
  /**
   * @param {string} id
   * @return {RemovedException}
   */
  static VIEW(id) {
    return new RemovedException(`ViewContainer: ${id}`)
  }

  toString() {
    return `RemovedException --- ${this.message} `
  }
}
