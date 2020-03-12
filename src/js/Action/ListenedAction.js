const __dispatcher = Symbol('__dispatcher')
const __actionID = Symbol('__actionDispatcher')
const __token = Symbol('__token')


export class ListenedAction {
  /**
   *
   * @param {Dispatcher} dispatcher
   * @param {string} actionID
   * @param {string} token
   */
  constructor(dispatcher, actionID, token) {

    this[__dispatcher] = dispatcher
    this[__actionID] = actionID
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
    this[__dispatcher].removeActionListener(this[__actionID], this[__token])
  }

}
