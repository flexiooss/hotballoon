import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer'
import {FakeLogger} from '@flexio-oss/js-commons-bundle/js-logger'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject'
import {ViewRenderConfig} from '../../js/Application/ViewRenderConfig'

const assert = require('assert')

export class TestComponentContext extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app(){
    return new HotBalloonApplication('id', new Dispatcher(new FakeLogger()), new FakeLogger().debug(), new ViewRenderConfig(null, false))
  }

  setUp() {
    this.dispatcher = new Dispatcher(new FakeLogger())
    this.APP = this.app()
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

  testAddStore() {
    const store = this.getStore()
    this.componentContext.addStore(store)
    assert.deepStrictEqual(this.componentContext.store(store.ID()), store)
  }

  testAddViewContainer() {
    const viewContainer = this.getViewContainer()
    this.componentContext.addViewContainer(viewContainer)
    assert.deepStrictEqual(this.componentContext.viewContainer(viewContainer.ID()), viewContainer)
  }

  testRemoveViewContainer() {
    const viewContainer = this.getViewContainer()
    this.componentContext.addViewContainer(viewContainer)
    this.componentContext.removeViewContainerEntry(viewContainer.ID())
    assert.deepStrictEqual(this.componentContext.viewContainer(viewContainer.ID()), null)
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
