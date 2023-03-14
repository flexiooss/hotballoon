import {TestCase} from '@flexio-oss/code-altimeter-js'
import {ActionDispatcherBuilder} from '../../js/Action/ActionDispatcherBuilder.js'
import {FakeObject, FakeObjectBuilder} from './FakeObject.js'
import {ApplicationBuilder} from '../../../ApplicationBuilder.js'
import {ActionSubscriber} from "../../js/Action/ActionSubscriber.js";
import {ActionResponseBuilder} from "../../js/Action/ActionResponseBuilder.js";


const assert = require('assert')


export class ActionDispatcherTest extends TestCase {
  // debug = true

  /**
   * @return {HotBalloonApplication}
   */
  app() {
    return new ApplicationBuilder()
      .build()
  }

  setUp() {
    this.APP = this.app()
    this.dispatcher = this.APP.dispatcher()
    this.componentContext = this.APP.addComponentContext()
  }

  testListenDispatch() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    /**
     * @type {ListenedAction}
     */
    const listenedAction = actionDispatcher.listen(
      (payload, actionResponseBuilder) => {
        throw new Error('listen')
      }
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    assert.throws(
      () => actionDispatcher.dispatch(payloadDispatched),
      /^Error: listen$/
    )

  }

  testListenDispatchWithResponseRejected() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .withResponse()
      .dispatcher(this.componentContext.dispatcher())
      .build()

    /**
     * @type {ListenedAction}
     */
    const listenedAction = actionDispatcher.listen(
      (payload, actionResponseBuilder) => {
        throw new Error('listen')
      }
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    actionDispatcher.dispatch(payloadDispatched).catch((e) => {
      this.log(e)
    })

    assert.rejects(
      () => actionDispatcher.dispatch(payloadDispatched),
      /^Error: listen$/
    )

  }

  async asyncTestListenDispatch() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    return new Promise((ok, ko) => {

      /**
       * @type {ListenedAction}
       */
      const listenedAction = actionDispatcher.listen(
        (payload, actionResponseBuilder, execution) => {
          ok()
        }
      )

      const payloadDispatched = new FakeObjectBuilder()
        .prop1('toto')
        .prop2(true)
        .prop3(3)
        .build()

      actionDispatcher.dispatch(payloadDispatched).catch((e) => {
        this.log(e)
      })

    })

  }

  testRemovedException() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    actionDispatcher.remove()

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    assert.throws(
      () => actionDispatcher.dispatch(payloadDispatched),
      /RemovedException/
    )
  }

  testListenDispatchValueListenDispatchValue() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    let p = null
    let t = null

    actionDispatcher.listen(
      (payload, type) => {
        p = payload
        t = type
      }
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()
    actionDispatcher.dispatch(payloadDispatched)

    assert.deepStrictEqual(p, payloadDispatched)
    assert.ok(t instanceof ActionResponseBuilder)
  }

  testListenDispatchOrder() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    let p = []

    actionDispatcher.listen(
      (payload, type) => {
        p.push(1)
      }
    )

    actionDispatcher.listen(
      (payload, type) => {
        p.push(2)
      }
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    actionDispatcher.dispatch(payloadDispatched)

    assert.deepStrictEqual(p, [1, 2])
  }

  testListenDispatchWaitFor() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    let p = []
    let a = false

    const token1 = actionDispatcher.listen(
      (payload, type) => {
        actionDispatcher.waitFor(token2.token())
        p.push(1)
      }
    )

    const token2 = actionDispatcher.listen(
      (payload, type) => {
        a = true
        p.push(2)
      }
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    actionDispatcher.dispatch(payloadDispatched)

    assert.deepStrictEqual(p, [2, 1])
  }

  testListenedAction() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    let a = 0

    const action = actionDispatcher.listen(
      (payload) => {
        a++
      })

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a, 1, 'action should be invoked')

    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a, 2, 'action should be invoked')

    action.remove()
    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a, 2, 'action should be removed')
  }

  testListenedActionGuard() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    let a = 0

    /**
     * @type {ActionSubscriber}
     */
    const actionSubscriber = ActionSubscriber.from(actionDispatcher)

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    /**
     * @type {ListenedAction}
     */
    const action = actionSubscriber.listen(
      payload => {
        a--
      },
      payload => payload.prop3() === 4
    )

    /**
     * @type {ListenedAction}
     */
    const action2 = actionSubscriber.listen(
      payload => {
        a++
      },
      payload => payload.prop3() === 3
    )

    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a, 1, 'action should not be invoked')

    actionDispatcher.dispatch(payloadDispatched.withProp3(4))

    assert.equal(a, 0, 'action2 should be invoked')

  }

  async asyncTestListenedActionWithoutResponse() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .dispatcher(this.componentContext.dispatcher())
      .build()

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    /**
     * @type {ListenedAction}
     */
    const listenedAction = actionDispatcher.listen(
      (payload, responseBuilder) => {
        responseBuilder.respond()
      }
    )

    await actionDispatcher.dispatch(payloadDispatched)

    return true

  }

  async asyncTestListenedActionWithResponse() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .withResponse()
      .dispatcher(this.componentContext.dispatcher())
      .build()

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    /**
     * @type {ListenedAction}
     */
    const listenedAction = actionDispatcher.listen(
      (payload, responseBuilder) => {
        setTimeout(() => {
          responseBuilder.respond()
        }, 1000)
      }
    )

    await actionDispatcher.dispatch(payloadDispatched)

    return true
  }

  testRemoveAction() {
    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher = new ActionDispatcherBuilder()
      .type(FakeObject)
      .withResponse()
      .dispatcher(this.componentContext.dispatcher())
      .build()

    const id = actionDispatcher.ID()
    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    /**
     * @type {ListenedAction}
     */
    const listenedAction = actionDispatcher.listen(
      (payload, responseBuilder) => {
      }
    )
    assert.ok(this.componentContext.dispatcher().hasEventListener(id, listenedAction.token()), 'should have listener')
   actionDispatcher.dispatch(payloadDispatched)

    assert.ok(this.componentContext.dispatcher().removeEventListener(ActionSubscriber.responseEventDispatcher(id)), 'should have response listener')


    /**
     *
     * @type {ActionDispatcher<FakeObject, FakeObjectBuilder>}
     */
    const actionDispatcher2 = new ActionDispatcherBuilder()
      .type(FakeObject)
      .withResponse()
      .dispatcher(this.componentContext.dispatcher())
      .build()

    /**
     * @type {ListenedAction}
     */
    const listenedAction2 = actionDispatcher2.listen(
      (payload, responseBuilder) => {
      }
    )

    const id2 = actionDispatcher2.ID()
    actionDispatcher2.dispatch(payloadDispatched)
    actionDispatcher2.remove()

    assert.ok(!this.componentContext.dispatcher().removeEventListener(id2), 'should not have listener')
    assert.ok(!this.componentContext.dispatcher().removeEventListener(ActionSubscriber.responseEventDispatcher(id2)), 'should not have response listener')

  }
}


runTest(ActionDispatcherTest)
