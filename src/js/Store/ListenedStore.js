const __stopListenChangedLBD = Symbol('__stopListenChangedLBD')
const __token = Symbol('__token')


export class ListenedStore {
  /**
   *
   * @param {function()} stopListenChangedLBD
   * @param {string} token
   */
  constructor(stopListenChangedLBD,  token) {

    this[__stopListenChangedLBD] = stopListenChangedLBD
    this[__token] = token
  }

  /**
   *
   * @return {string}
   */
  token() {
    return this[__token]
  }

  remove() {
    this[__stopListenChangedLBD].call()
  }

}
