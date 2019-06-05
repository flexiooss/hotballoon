import {TestCase} from 'code-altimeter-js'
import {StoreBuilder, InMemoryParams, ProxyParams} from '../../js/Store/StoreBuilder'
import {StoreTypeParam} from '../../js/Store/StoreTypeParam'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer'
import {FakeLogger} from '@flexio-oss/js-logger'

const assert = require('assert')

export class TestComponentContext extends TestCase {
  setUp() {
    this.dispatcher = new Dispatcher()
    this.APP = new HotBalloonApplication('id', this.dispatcher, new FakeLogger().debug())
    this.componentContext = this.APP.addComponentContext()
  }

  testGetApplicationFromComponentContext() {
    assert(this.componentContext.APP() === this.APP)
  }

  testGetDispatcherFromComponentContext() {
    assert(this.componentContext.dispatcher() === this.dispatcher)
  }

  testNextId() {
    const id1 = this.componentContext.nextID()
    const id2 = this.componentContext.nextID()
    assert(id1 !== id2)
  }

  testAddStore() {
    const store = this.getStore()
    this.componentContext.addStore(store)
    assert(this.componentContext.store(store.ID) === store)
  }

  testAddViewContainer() {
    const viewContainer = this.getViewContainer()
    this.componentContext.addViewContainer(viewContainer)
    assert(this.componentContext.viewContainer(viewContainer.ID) === viewContainer)
  }

  testRemoveViewContainer() {
    const viewContainer = this.getViewContainer()
    this.componentContext.addViewContainer(viewContainer)
    this.componentContext.removeViewContainer(viewContainer.ID)
    assert(this.componentContext.viewContainer(viewContainer.ID) === undefined)
  }

  getStore() {
    return StoreBuilder
      .InMemory(
        new InMemoryParams(
          new StoreTypeParam(
            Object,
            v => v,
            v => true,
            o => o
          ),
          {
            a: 1,
            b: 2
          }
        )
      )
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
