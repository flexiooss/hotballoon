import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer'
import {FakeLogger} from '@flexio-oss/js-logger'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject'

const assert = require('assert')

export class TestComponentContext extends TestCase {
  setUp() {
    this.dispatcher = new Dispatcher(new FakeLogger())
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
    // console.log(this.componentContext.viewContainer(viewContainer.ID))
    this.componentContext.removeViewContainerEntry(viewContainer.ID)
    // console.log(this.componentContext.viewContainer(viewContainer.ID))
    assert(this.componentContext.viewContainer(viewContainer.ID) === null)
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
