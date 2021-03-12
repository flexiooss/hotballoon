import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer'
import {FakeLogger} from '@flexio-oss/js-commons-bundle/js-logger'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject'
import {ApplicationBuilder} from '../../js/Application/ApplicationBuilder'

const assert = require('assert')

export class TestComponentContext extends TestCase {
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

  testGetApplicationFromComponentContext() {
    assert.deepStrictEqual(this.componentContext.APP(), this.APP)
  }

  testGetDispatcherFromComponentContext() {
    assert.deepStrictEqual(this.componentContext.dispatcher(), this.dispatcher)
  }

  testNextId() {
    const id1 = this.componentContext.nextID()
    const id2 = this.componentContext.nextID()
    assert.notEqual(id1, id2)
  }

  getStore() {
    /**
     *
     * @type {Store<FakeValueObject, FakeValueObjectBuilder>}
     */
    return new InMemoryStoreBuilder()
      .type(FakeValueObject)
      .initialData(new FakeValueObject())
      .build()
  }

  getViewContainer() {
    return new ViewContainer(
      new ViewContainerParameters(
        this.componentContext, 'id', {nodeType: 2}
      )
    )
  }
}

runTest(TestComponentContext)
