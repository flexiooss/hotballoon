import {TestCase} from 'code-altimeter-js'
import {TypeCheck} from '../js/TypeCheck'
import {StoreBuilder, InMemoryParams, ProxyParams} from '../js/Store/StoreBuilder'
import {StoreTypeParam} from '../js/Store/StoreTypeParam'
import {PublicStoreHandler} from '../js/Store/PublicStoreHandler'
import {HotBalloonApplication} from '../js/Application/HotBalloonApplication'
import {Dispatcher} from '../js/Dispatcher/Dispatcher'
import {ExecutorInline} from '../js/Job/ExecutorInline'
import {ExecutorWorker} from '../js/Job/ExecutorWorker'
import {ActionBuilder, PublicActionParams} from '../js/Action/ActionBuilder'
import {ActionTypeParam} from '../js/Action/ActionTypeParam'
import {ViewContainer, ViewContainerParameters} from '../js/View/ViewContainer'
import {View} from '../js/View/View'

const assert = require('assert')

export class TestTypeCheck extends TestCase {
  testIsStoreBase() {
    const store = StoreBuilder
      .InMemory(
        new InMemoryParams(
          new StoreTypeParam(
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
        new ProxyParams(
          new StoreTypeParam(
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
        new ProxyParams(
          new StoreTypeParam(
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
    const app = new HotBalloonApplication('id', new Dispatcher())
    assert(TypeCheck.isHotballoonApplication(app))
  }

  testIsComponentContext() {
    const componentContext = new HotBalloonApplication('id', new Dispatcher()).addComponentContext()
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

  testIsAction() {
    const action = ActionBuilder.build(
      new PublicActionParams(
        new ActionTypeParam(
          Object,
          v => v,
          v => true
        ),
        new Dispatcher()
      )
    )
    assert(TypeCheck.isAction(action))
  }

  testIsViewContainer() {
    const viewContainer = new ViewContainer(
      new ViewContainerParameters(
        Object, 'id', {nodeType: 2}
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
