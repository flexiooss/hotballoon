import { assertType, isNull, TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert/index.js'
import {EventAction} from './EventAction.js'
import {ValidationError} from '../Exception/ValidationError.js'
import { CLASS_TAG_NAME_ACTION_DISPATCHER} from '../Types/HasTagClassNameInterface.js'
import {ActionSubscriber} from './ActionSubscriber.js'
import {RemovedException} from "../Exception/RemovedException.js";


/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcher extends ActionSubscriber {

  /**
   * @param {ActionDispatcherConfig<TYPE, TYPE_BUILDER>} config
   */
  constructor(config) {
    super(config,CLASS_TAG_NAME_ACTION_DISPATCHER)
  }

  /**
   * @return {?TYPE_BUILDER}
   */
  payloadBuilder() {
    if (isNull(this.config().type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.config().type().builder)
    return this.config().type().builder()
  }

  /**
   * @param {Object} object
   * @return {?TYPE_BUILDER}
   */
  payloadFromObject(object) {
    if (isNull(this.config().type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.config().type().fromObject)
    return this.config().type().fromObject(object)
  }

  /**
   * @param {TYPE} instance
   * @return {?TYPE_BUILDER}
   */
  payloadFrom(instance) {
    if (isNull(this.config().type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.config().type().from)
    return this.config().type().from(instance)
  }

  /**
   * @param {string} json
   * @return {TYPE_BUILDER}
   */
  payloadFromJSON(json) {
    if (isNull(this.config().type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this.config().type().fromJSON)
    return this.config().type().fromJSON(json)
  }


  /**
   * @param {?TYPE} [payload=null]
   * @throws {RemovedException}
   */
  dispatch(payload = null) {
    if (this.isRemoved()) {
      throw RemovedException.ACTION(this._ID)
    }
    if (!isNull(this.config().type())) {
      const checker = this.config().defaultChecker()
      /**
       * @type {TYPE}
       */
      const data = checker(payload)

      assertType(
        data instanceof this.__type__(),
        'hotballoon:ActionDispatcher:dispatch "data" argument should be an instance of %s',
        this.__type__().name
      )
      if (!isNull(this.config().validator()) && !this.config().validator().isValid(payload)) {
        throw new ValidationError('hotballoon:ActionDispatcher:dispatch "data" argument failed to validation')
      }
    }

    this.config().dispatcher().dispatchAction(
      EventAction.create(this.ID(), payload)
    )
  }

}
