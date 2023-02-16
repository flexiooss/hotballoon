import {ListenedActionMap} from './ListenedActionMap.js'
import {TypeCheck} from '../Types/TypeCheck.js'
import {ActionMap} from './ActionMap.js'
import {AlreadyRegisteredException} from '../Exception/AlreadyRegisteredException.js'

/**
 * @template TYPE
 */
export class ActionsHandler {
  /**
   * @type {ListenedActionMap}
   */
  #listenedActions = new ListenedActionMap()
  /**
   * @type {ActionMap}
   */
  #actions = new ActionMap()

  /**
   * @param {ActionDispatcher} actionDispatcher
   * @return {ActionDispatcher}
   */
  attach(actionDispatcher) {
    if (this.#actions.has(actionDispatcher.ID())) {
      throw AlreadyRegisteredException.ACTION(actionDispatcher.ID())
    }
    this.#actions.set(actionDispatcher.ID(), actionDispatcher)
    return actionDispatcher
  }

  /**
   * @param {ActionDispatcher} actionDispatcher
   * @return {ActionsHandler}
   */
  detach(actionDispatcher) {
    this.#actions.delete(actionDispatcher.ID())
    return this
  }

  /**
   * @param {ActionSubscriber} actionSubscriber
   * @param {function(payload: ?TYPE, type: (string|Symbol))}  callback
   * @param {?function(state: StoreState<TYPE>)} [guard=null]
   * @return {ListenedAction}
   */
  listen(actionSubscriber, callback, guard=null) {
    /**
     * @type {ListenedAction}
     */
    const listenedAction = TypeCheck.assertIsActionSubscriber(actionSubscriber).listen(callback, guard)
    this.#listenedActions.set(listenedAction.token(), listenedAction)
    return new ListenedAction(this, listenedAction.token())
  }

  /**
   * @param {string} token
   * @return {boolean}
   */
  unListen(token) {
    if (this.#listenedActions.has(token)) {
      this.#listenedActions.get(token).remove()
      this.#listenedActions.delete(token)
      return true
    }
    return false
  }

  remove() {
    this.#actions.forEach(
      /**
       * @param {ActionDispatcher} v
       */
      v => {
        v.remove()
      })

    this.#listenedActions.forEach(
      /**
       * @param {ListenedAction} v
       */
      v => {
        v.remove()
      })

    this.clear()
  }

  /**
   * @return {ActionsHandler}
   */
  clear() {
    this.#actions.clear()
    this.#listenedActions.clear()
    return this
  }
}

class ListenedAction {
  /**
   * @type {ActionsHandler}
   */
  #handler
  /**
   * @type {string}
   */
  #token

  /**
   * @param  {ActionsHandler} handler
   * @param {string} token
   */
  constructor(handler, token) {
    this.#handler = handler
    this.#token = token
  }

  /**
   * @return {string}
   */
  token() {
    return this.#token
  }

  /**
   * @return {boolean}
   */
  remove() {
    return this.#handler.unListen(this.#token)
  }
}
