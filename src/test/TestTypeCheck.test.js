import {TestCase} from 'code-altimeter-js'
import {TypeCheck} from '../js/TypeCheck'
import {StoreBuilder, InMemoryParams, ProxyParams} from '../js/Store/StoreBuilder'
import {StoreTypeParam} from '../js/Store/StoreTypeParam'
import {PublicStoreHandler} from '../js/Store/PublicStoreHandler'

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
}

runTest(TestTypeCheck)
