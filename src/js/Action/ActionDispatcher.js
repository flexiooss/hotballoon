import {assertType, isNull, TypeCheck as TypeTypeCheck} from '@flexio-oss/js-commons-bundle/assert'
import {EventAction} from './EventAction'
import {ActionDispatcherConfig} from './ActionDispatcherConfig'
import {DispatcherEventListenerConfigBuilder} from '../Dispatcher/DispatcherEventListenerConfigBuilder'
import {WithID} from '../abstract/WithID'
import {ValidationError} from '../Exception/ValidationError'
import {CLASS_TAG_NAME, CLASS_TAG_NAME_ACTION} from '../Types/HasTagClassNameInterface'
import {TypeCheck} from '../Types/TypeCheck'
import {ListenedAction} from './ListenedAction'


const _actionConfig = Symbol('_actionParams')


/**
 * @implements {HasTagClassNameInterface}
 * @implements {GenericType<TYPE>}
 * @template TYPE, TYPE_BUILDER
 */
export class ActionDispatcher extends WithID {
  /**
   * @param {ActionDispatcherConfig<TYPE, TYPE_BUILDER>} actionConfig
   */
  constructor(actionConfig) {
    super(actionConfig.id())

    assertType(actionConfig instanceof ActionDispatcherConfig,
      'hotballoon:ActionDispatcher:constructor "actionConfig" argument assert be an instance of ActionDispatcherConfig'
    )

    Object.defineProperty(this, CLASS_TAG_NAME, {
      configurable: false,
      writable: false,
      enumerable: true,
      value: CLASS_TAG_NAME_ACTION
    })

    Object.defineProperties(this, {
      [_actionConfig]: {
        configurable: false,
        enumerable: false,
        writable: false,
        value: actionConfig
      }
    })
  }

  /**
   * @return {?TYPE_BUILDER}
   */
  payloadBuilder() {
    if (isNull(this[_actionConfig].type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this[_actionConfig].type().builder)
    return this[_actionConfig].type().builder()
  }

  /**
   * @param {Object} object
   * @return {?TYPE_BUILDER}
   */
  payloadFromObject(object) {
    if (isNull(this[_actionConfig].type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this[_actionConfig].type().fromObject)
    return this[_actionConfig].type().fromObject(object)
  }

  /**
   * @param {TYPE} instance
   * @return {?TYPE_BUILDER}
   */
  payloadFrom(instance) {
    if (isNull(this[_actionConfig].type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this[_actionConfig].type().from)
    return this[_actionConfig].type().from(instance)
  }

  /**
   * @param {string} json
   * @return {TYPE_BUILDER}
   */
  payloadFromJSON(json) {
    if (isNull(this[_actionConfig].type())) {
      return null
    }
    TypeTypeCheck.assertIsFunction(this[_actionConfig].type().fromJSON)
    return this[_actionConfig].type().fromJSON(json)
  }

  /**
   * @return {?Class<TYPE>}
   */
  __type__() {
    return this[_actionConfig].type()
  }

  /**
   * @param {Class} constructor
   * @return {boolean}
   */
  isTypeOf(constructor) {
    if (isNull(this[_actionConfig].type())) {
      return isNull(constructor)
    }
    return constructor === this.__type__()
  }

  /**
   * @param {?TYPE} [payload=null]
   */
  dispatch(payload = null) {
    if (!isNull(this[_actionConfig].type())) {
      const checker = this[_actionConfig].defaultChecker()
      /**
       * @type {TYPE}
       */
      const data = checker(payload)

      assertType(
        data instanceof this.__type__(),
        'hotballoon:ActionDispatcher:dispatch "data" argument should be an instance of %s',
        this.__type__().name
      )
      if (!isNull(this[_actionConfig].validator()) && !this[_actionConfig].validator().isValid(payload)) {
        throw new ValidationError('hotballoon:ActionDispatcher:dispatch "data" argument failed to validation')
      }
    }

    this[_actionConfig].dispatcher().dispatchAction(
      EventAction.create(
        this.ID(),
        payload
      )
    )
  }

  /**
   * @param {function(payload: ?TYPE, type: (string|Symbol))} callback
   * @param {ComponentContext} componentContext
   * @returns {ListenedAction}
   */
  listenWithCallback(callback, componentContext) {
    TypeCheck.assertIsComponentContext(componentContext)
    /**
     * @type {string}
     */
    const token = componentContext
      .addActionToken(
        this[_actionConfig].dispatcher()
          .addActionListener(
            DispatcherEventListenerConfigBuilder
              .listen(this)
              .callback(callback)
              .build()
          ),
        this
      )

    return new ListenedAction(this[_actionConfig].dispatcher(), this.ID(), token)
  }

  /**
   * @param {...string} token
   */
  waitFor(...token) {
    this[_actionConfig].dispatcher().waitFor(this.ID(), token)
  }
}
