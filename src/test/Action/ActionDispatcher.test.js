import {TestCase} from '@flexio-oss/code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {FakeLogger} from '@flexio-oss/js-commons-bundle/js-logger'
import {ActionDispatcherBuilder} from '../../js/Action/ActionDispatcherBuilder'
import {FakeObject, FakeObjectBuilder} from './FakeObject'
import {ApplicationBuilder} from '../../js/Application/ApplicationBuilder'


const assert = require('assert')


export class ActionDispatcherTest extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app(){
    return new ApplicationBuilder()
      .logger(new FakeLogger().debug())
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

}


runTest(ActionDispatcherTest)
