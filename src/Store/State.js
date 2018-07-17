export class State {
  /**
   *
   * @param {string} storeId
   * @param {any} data
   */
  constructor(storeId, data) {
    Object.defineProperties(this, {
      storeID: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: storeId
      },
      data: {
        configurable: false,
        writable: false,
        enumerable: true,
        value: data
      }
    })
    Object.freeze(Object.seal(this))
  }

  /**
   *
   * @return {State}
   * @static
   */
  static createEmpty() {
    return new State('', {})
  }
}
