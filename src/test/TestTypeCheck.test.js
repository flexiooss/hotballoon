import {TestCase} from '@flexio-oss/code-altimeter-js'
import {TypeCheck} from '../js/Types/TypeCheck'
import {InMemoryStoreBuilder} from '../js/Store/InMemoryStoreBuilder'
import {ProxyStoreBuilder} from '../js/Store/ProxyStoreBuilder'
import {PublicStoreHandler} from '../js/Store/PublicStoreHandler'
import {HotBalloonApplication} from '../js/Application/HotBalloonApplication'
import {Dispatcher} from '../js/Dispatcher/Dispatcher'
import {ExecutorInline} from '../js/Job/ExecutorInline'
import {ExecutorWorker} from '../js/Job/ExecutorWorker'
import {ActionDispatcherBuilder} from '../js/Action/ActionDispatcherBuilder'
import {ViewContainer, ViewContainerParameters} from '../js/View/ViewContainer'
import {View} from '../js/View/View'
import {FakeValueObject, FakeValueObjectBuilder} from './FakeValueObject'
import {ComponentContextBuilder} from '../js/Application/ComponentContextBuilder'
import {ApplicationBuilder} from '../js/Application/ApplicationBuilder'

const assert = require('assert')

export class TestTypeCheck extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app() {
    return new ApplicationBuilder()
      .build()
  }

  testIsStoreBase() {
    /**
     *
     * @type {Store<FakeValueObject, FakeValueObjectBuilder>}
     */
    const store = new InMemoryStoreBuilder()
      .type(FakeValueObject)
      .initialData(new FakeValueObject())
      .build()

    assert(TypeCheck.isStoreBase(store))

    /**
     *
     * @type {PublicStoreHandler<FakeValueObject, FakeValueObjectBuilder>}
     */
    const publicStoreHandler = new PublicStoreHandler(store)
    assert(TypeCheck.isStoreBase(publicStoreHandler))

    /**
     *
     * @type {ProxyStore<FakeValueObject, FakeValueObject, FakeValueObjectBuilder>}
     */
    const proxyStore = new ProxyStoreBuilder()
      .store(store)
      .type(FakeValueObject)
      .mapper(
        (data) => FakeValueObjectBuilder.from(data).build())
      .build()

    assert(TypeCheck.isStoreBase(proxyStore))

    /**
     *
     * @type {ProxyStore<FakeValueObject, FakeValueObject, FakeValueObjectBuilder>}
     */
    const proxyStoreFromPublic = new ProxyStoreBuilder()
      .store(publicStoreHandler)
      .type(FakeValueObject)
      .mapper(
        (data) => FakeValueObjectBuilder.from(data).build())
      .build()
    assert(TypeCheck.isStoreBase(proxyStoreFromPublic))
  }

  testIsHotballoonApplication() {
    assert(TypeCheck.isHotballoonApplication(this.app()))
  }

  testIsComponentContext() {
    const componentContext = this.app().addComponentContext()
    assert(TypeCheck.isComponentContext(componentContext))
  }

  testIsDispatcher() {
    const dispatcher = new Dispatcher()
    assert(TypeCheck.isDispatcher(dispatcher))
  }

  testIsExecutor() {
    let executor = new ExecutorInline()
    assert(TypeCheck.isExecutor(executor))
    executor = new ExecutorWorker()
    assert(TypeCheck.isExecutor(executor))
  }

  testIsActionDispatcher() {
    /**
     *
     * @type {ActionDispatcher<FakeValueObject, FakeValueObjectBuilder>}
     */
    const action = new ActionDispatcherBuilder()
      .type(FakeValueObject)
      .dispatcher(new Dispatcher())
      .build()

    assert(TypeCheck.isActionDispatcher(action))
  }

  testIsViewContainer() {
    const viewContainer = new ViewContainer(
      new ViewContainerParameters(
        new ComponentContextBuilder()
          .application(this.app())
          .build()
        , 'id', {nodeType: 2}
      )
    )
    assert(TypeCheck.isViewContainer(viewContainer))
    assert(TypeCheck.isViewContainerBase(viewContainer))
  }

  tesIsView() {
    const view = new View(
      new ViewContainer(
        new ViewContainerParameters(
          Object, 'id', {nodeType: 2}
        )
      )
    )
    assert(TypeCheck.isView(view))
    assert(TypeCheck.isViewContainerBase(view))
  }
}

runTest(TestTypeCheck)
