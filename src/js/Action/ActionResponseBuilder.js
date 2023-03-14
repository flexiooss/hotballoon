import {TypeCheck} from "@flexio-oss/js-commons-bundle/assert/index.js";
import {TypeCheck as HBTypeCheck} from "../Types/TypeCheck.js";

export class ActionResponseBuilder {
  /**
   * @type {Dispatcher}
   */
  #dispatcher
  /**
   * @type {string}
   */
  #eventName
  /**
   * @type {string}
   */
  #executionId

  /**
   * @param {Dispatcher} dispatcher
   * @param {string} eventName
   * @param {string} executionId
   */
  constructor(dispatcher, eventName, executionId,) {
    this.#dispatcher = HBTypeCheck.assertIsDispatcher(dispatcher);
    this.#eventName = TypeCheck.assertIsString(eventName);
    this.#executionId = TypeCheck.assertIsString(executionId);
  }

  respond() {
    this.#dispatcher.dispatch(this.#eventName, this.#executionId)
  }
}