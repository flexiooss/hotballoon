import {TestCase} from 'code-altimeter-js'
import {StoreBuilder, InMemoryParams, ProxyParams} from '../../js/Store/StoreBuilder'
import {StoreTypeParam} from '../../js/Store/StoreTypeParam'

const assert = require('assert')

export class TestProxyStore extends TestCase {
  setUp() {
    this.store = StoreBuilder
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

  testInit() {
    let invoked = 0
    this.proxyStore = StoreBuilder
      .Proxy(
        new ProxyParams(
          new StoreTypeParam(
            Object,
            v => v,
            v => true,
            o => o
          ),
          this.store,
          v => {
            invoked++
            return {
              a: v.a + 1,
              b: v.b + 1
            }
          }
        )
      )

    assert(invoked === 1, 'Mapper should be invoked once at init')

    assert.deepEqual(this.proxyStore.state().data, {
      a: 2,
      b: 3
    }, 'Mapper should be invoked at init')
  }

  testUpdateFromStoreEvent() {
    this.proxyStore = StoreBuilder
      .Proxy(
        new ProxyParams(
          new StoreTypeParam(
            Object,
            v => v,
            v => true,
            o => o
          ),
          this.store,
          v => {
            return {
              a: v.a + 1,
              b: v.b + 1
            }
          }
        )
      )

    this.store.set({a: 10, b: 20})

    assert.deepEqual(this.proxyStore.state().data, {
      a: 11,
      b: 21
    }, 'Mapper should be invoked after store update')
  }
}

runTest(TestProxyStore)
