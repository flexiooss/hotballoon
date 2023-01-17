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
import {ApplicationBuilder} from '../../ApplicationBuilder'

const assert = require('assert')

export class TestTypeCheck extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app() {
    return new ApplicationBuilder()
      // .document(new FakeDocument())
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

    assert.ok(TypeCheck.isStoreBase(store))

    /**
     *
     * @type {PublicStoreHandler<FakeValueObject, FakeValueObjectBuilder>}
     */
    const publicStoreHandler = new PublicStoreHandler(store)
    assert.ok(TypeCheck.isPublicStoreHandler(publicStoreHandler))
    assert.doesNotThrow(() => TypeCheck.assertIsPublicStoreHandler(publicStoreHandler))

    /**
     * @type {ProxyStore<FakeValueObject, FakeValueObject, FakeValueObjectBuilder>}
     */
    const proxyStore = new ProxyStoreBuilder()
      .store(store)
      .type(FakeValueObject)
      .mapper(
        (data) => FakeValueObjectBuilder.from(data).build())
      .build()

    assert.ok(TypeCheck.isStoreBase(proxyStore))
    assert.ok(TypeCheck.isProxyStore(proxyStore))
    assert.doesNotThrow(() => TypeCheck.assertIsProxyStore(proxyStore))

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
    assert.ok(TypeCheck.isStoreBase(proxyStoreFromPublic))
    assert.ok(TypeCheck.isProxyStore(proxyStoreFromPublic))
  }

  testIsHotballoonApplication() {
    assert.ok(TypeCheck.isHotballoonApplication(this.app()))
    assert.doesNotThrow(() => TypeCheck.assertIsHotBalloonApplication(this.app()))
  }

  testIsComponentContext() {
    const componentContext = this.app().addComponentContext()
    assert.ok(TypeCheck.isComponentContext(componentContext))
    assert.doesNotThrow(() => TypeCheck.assertIsComponentContext(componentContext))
  }

  testIsDispatcher() {
    const dispatcher = new Dispatcher()
    assert.ok(TypeCheck.isDispatcher(dispatcher))
    assert.doesNotThrow(() => TypeCheck.assertIsDispatcher(dispatcher))
  }

  testIsExecutor() {
    let executor = new ExecutorInline()
    assert.ok(TypeCheck.isExecutor(executor))
    executor = new ExecutorWorker()
    assert.ok(TypeCheck.isExecutor(executor))
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

    assert.ok(TypeCheck.isActionDispatcher(action))
    assert.doesNotThrow(() => TypeCheck.assertIsActionDispatcher(action))
  }

  testIsActionDispatcherTypeof() {
    /**
     *
     * @type {ActionDispatcher<FakeValueObject, FakeValueObjectBuilder>}
     */
    const action = new ActionDispatcherBuilder()
      .type(FakeValueObject)
      .dispatcher(new Dispatcher())
      .build()

    assert.doesNotThrow(() => TypeCheck.assertIsActionDispatcher(action, FakeValueObject, 'FakeValueObject'))
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
    assert.ok(TypeCheck.isViewContainer(viewContainer))
    assert.ok(TypeCheck.isViewContainerBase(viewContainer))
  }

  tesIsView() {
    const view = new View(
      new ViewContainer(
        new ViewContainerParameters(
          Object, 'id', {nodeType: 2}
        )
      )
    )
    assert.ok(TypeCheck.isView(view))
    assert.ok(TypeCheck.isViewContainerBase(view))
    assert.doesNotThrow(() => TypeCheck.assertIsView(view))
  }
}

runTest(TestTypeCheck)
