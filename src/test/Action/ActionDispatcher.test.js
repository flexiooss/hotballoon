import {TestCase} from '@flexio-oss/code-altimeter-js'
import {ActionDispatcherBuilder} from '../../js/Action/ActionDispatcherBuilder.js'
import {FakeObject, FakeObjectBuilder} from './FakeObject.js'
import {ApplicationBuilder} from '../../../ApplicationBuilder.js'
import {ActionSubscriber} from "../../js/Action/ActionSubscriber.js";


const assert = require('assert')


export class ActionDispatcherTest extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app(){
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

    let p = null
    let t = null

    actionDispatcher.listen(
      (payload, type) => {
        throw new Error('listen')
      }
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    assert.throws(() => {

        actionDispatcher.dispatch(payloadDispatched)
      },
      /^Error: listen$/
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
    assert.equal(t, actionDispatcher.ID())
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

    assert.equal(a,1, 'action should be invoked')

    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a,2, 'action should be invoked')

    action.remove()
    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a,2, 'action should be removed')
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
      payload=> {
      a--
    },
      payload=> payload.prop3() === 4
    )

    /**
     * @type {ListenedAction}
     */
    const action2 = actionSubscriber.listen(
      payload=> {
      a++
    },
      payload=> payload.prop3() === 3
    )

    actionDispatcher.dispatch(payloadDispatched)

    assert.equal(a,1, 'action should not be invoked')

    actionDispatcher.dispatch(payloadDispatched.withProp3(4))

    assert.equal(a,0, 'action2 should be invoked')

  }

}


runTest(ActionDispatcherTest)
