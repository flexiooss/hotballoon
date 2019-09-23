import {TestCase} from 'code-altimeter-js'
import {StoreBuilder, InMemoryConfig, ProxyConfig} from '../../js/Store/StoreBuilder'
import {StoreTypeConfig} from '../../js/Store/StoreTypeConfig'

const assert = require('assert')

export class TestProxyStore extends TestCase {
  setUp() {
    this.store = StoreBuilder
      .InMemory(
        new InMemoryConfig(
          new StoreTypeConfig(
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
        new ProxyConfig(
          new StoreTypeConfig(
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
        new ProxyConfig(
          new StoreTypeConfig(
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
