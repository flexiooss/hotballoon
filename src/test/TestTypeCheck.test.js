import {TestCase} from 'code-altimeter-js'
import {TypeCheck} from '../js/Types/TypeCheck'
import {StoreBuilder, InMemoryConfig, ProxyConfig} from '../js/Store/StoreBuilder'
import {StoreTypeConfig} from '../js/Store/StoreTypeConfig'
import {PublicStoreHandler} from '../js/Store/PublicStoreHandler'
import {HotBalloonApplication} from '../js/Application/HotBalloonApplication'
import {ComponentContext} from '../js/Component/ComponentContext'
import {Dispatcher} from '../js/Dispatcher/Dispatcher'
import {ExecutorInline} from '../js/Job/ExecutorInline'
import {ExecutorWorker} from '../js/Job/ExecutorWorker'
import {ActionDispatcherBuilder, PublicActionDispatcherConfig} from '../js/Action/ActionDispatcherBuilder'
import {ActionTypeConfig} from '../js/Action/ActionTypeConfig'
import {ViewContainer, ViewContainerParameters} from '../js/View/ViewContainer'
import {View} from '../js/View/View'
import {FakeLogger} from '@flexio-oss/js-logger'

const assert = require('assert')

class FakeValueObject {

}

export class TestTypeCheck extends TestCase {
  testIsStoreBase() {
    const store = StoreBuilder
      .InMemory(
        new InMemoryConfig(
          new StoreTypeConfig(
            Object,
            v => v,
            v => true,
            o => o
          ),
          {}
        )
      )

    assert(TypeCheck.isStoreBase(store))

    const publicStoreHandler = new PublicStoreHandler(store)
    assert(TypeCheck.isStoreBase(publicStoreHandler))

    const proxyStore = StoreBuilder
      .Proxy(
        new ProxyConfig(
          new StoreTypeConfig(
            Object,
            v => v,
            v => true,
            o => o
          ),
          store,
          v => v
        )
      )
    assert(TypeCheck.isStoreBase(proxyStore))

    const proxyStoreFromPublic = StoreBuilder
      .Proxy(
        new ProxyConfig(
          new StoreTypeConfig(
            Object,
            v => v,
            v => true,
            o => o
          ),
          publicStoreHandler,
          v => v
        )
      )
    assert(TypeCheck.isStoreBase(proxyStoreFromPublic))
  }

  testIsHotballoonApplication() {
    const app = new HotBalloonApplication('id', new Dispatcher(), new FakeLogger().debug())
    assert(TypeCheck.isHotballoonApplication(app))
  }

  testIsComponentContext() {
    const componentContext = new HotBalloonApplication('id', new Dispatcher(), new FakeLogger().debug()).addComponentContext()
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
    const action = ActionDispatcherBuilder.build(
      new PublicActionDispatcherConfig(
        new ActionTypeConfig(
          FakeValueObject,
          v => v,
          v => true
        ),
        new Dispatcher()
      )
    )
    assert(TypeCheck.isActionDispatcher(action))
  }

  testIsViewContainer() {
    const viewContainer = new ViewContainer(
      new ViewContainerParameters(
        new ComponentContext(new HotBalloonApplication('test', new Dispatcher(), new FakeLogger())), 'id', {nodeType: 2}
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
