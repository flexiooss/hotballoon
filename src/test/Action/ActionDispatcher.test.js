import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {FakeLogger} from '@flexio-oss/js-logger'
import {ActionDispatcherBuilder} from '../../js/Action/ActionDispatcherBuilder'
import {FakeObject, FakeObjectBuilder} from './FakeObject'

const assert = require('assert')

export class ActionDispatcherTest extends TestCase {
  setUp() {
    this.dispatcher = new Dispatcher(new FakeLogger())
    this.APP = new HotBalloonApplication('id', this.dispatcher, new FakeLogger().debug())
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

    actionDispatcher.listenWithCallback(
      (payload, type) => {
        throw new Error('listenWithCallback')
      },
      this.componentContext
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    assert.throws(() => {

        actionDispatcher.dispatch(payloadDispatched)
      },
      /^Error: listenWithCallback$/
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
    console.log('plok')

    actionDispatcher.listenWithCallback(
      (payload, type) => {
        p = payload
        t = type
      },
      this.componentContext
    )
    console.log('plok1')

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()
    console.log('plok2')
    actionDispatcher.dispatch(payloadDispatched)

    console.log('plok3')

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

    actionDispatcher.listenWithCallback(
      (payload, type) => {
        p.push(1)
      },
      this.componentContext
    )

    actionDispatcher.listenWithCallback(
      (payload, type) => {
        p.push(2)
      },
      this.componentContext
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

    const token1 = actionDispatcher.listenWithCallback(
      (payload, type) => {
        actionDispatcher.waitFor(token2)
        p.push(1)
      },
      this.componentContext
    )

    const token2 = actionDispatcher.listenWithCallback(
      (payload, type) => {
        a = true
        p.push(2)
      },
      this.componentContext
    )

    const payloadDispatched = new FakeObjectBuilder()
      .prop1('toto')
      .prop2(true)
      .prop3(3)
      .build()

    actionDispatcher.dispatch(payloadDispatched)

    assert.deepStrictEqual(p, [2, 1])
  }

}

runTest(ActionDispatcherTest)
