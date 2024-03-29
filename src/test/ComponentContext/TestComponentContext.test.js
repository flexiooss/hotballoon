import {TestCase} from '@flexio-oss/code-altimeter-js'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer.js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import {ApplicationBuilder} from '../../../ApplicationBuilder.js'

const assert = require('assert')

export class TestComponentContext extends TestCase {
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
