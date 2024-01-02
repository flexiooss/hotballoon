import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'

import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import {ProxyStoreListenerThrottledBuilder} from "../../js/Store/ProxyStoreListenerThrottled.js";

const assert = require('assert')

export class TestProxyStoreListenerThrottledTest extends TestCase {
  // debug = true

  setUp() {
    this.store = new InMemoryStoreBuilder()
      .type(FakeValueObject)
      .initialData(
        new FakeValueObjectBuilder()
          .a(1)
          .b(10)
          .build()
      )
      .build()
  }

  testInit() {
    let invoked = 0
    this.proxyStore = new ProxyStoreListenerThrottledBuilder()
      .store(this.store)
      .build()
  }

  async asyncTestFirstLast() {
    let invoked = 0
    let state = null
    /**
     * @type {ProxyStoreListenerThrottled}
     */
    this.proxyStore = new ProxyStoreListenerThrottledBuilder()
      .store(this.store)
      .timeToThrottle(300)
      .build()

    this.proxyStore.listenChanged(
      b => b.callback((p) => {

        invoked++
        state = p.data()
        this.log(invoked, 'asyncTestFirstLast changed')
      })
        .build()
    )

    this.store.set(
      new FakeValueObjectBuilder()
        .a(1)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(2)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(3)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(4)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(5)
        .b(20)
        .build())

    this.log(invoked)

    assert.strictEqual(invoked, 1, 'synchronous invoked')
    assert.ok(state.a() === 1, 'first invoked')

    return new Promise((ok, ko) => {
      setTimeout(() => {
        this.log('END', 'asyncTestFirstLast')
        assert.strictEqual(invoked, 2, 'asynchronous invoked')
        assert.ok(state.a() === 5, 'last invoked')
        ok()
      }, 5000)
    })
  }

  async asyncTestFirst() {
    let invoked = 0
    let state = null
    /**
     * @type {ProxyStoreListenerThrottled}
     */
    this.proxyStore = new ProxyStoreListenerThrottledBuilder()
      .store(this.store)
      .dispatchFirst()
      .build()

    this.proxyStore.listenChanged(
      b => b.callback((p) => {
        invoked++
        state = p.data()
      })
        .build()
    )

    this.store.set(
      new FakeValueObjectBuilder()
        .a(1)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(2)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(3)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(4)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(5)
        .b(20)
        .build())

    this.log(invoked)

    assert.strictEqual(invoked, 1, 'synchronous invoked')
        assert.ok(state.a() === 1, 'first invoked')

    return new Promise((ok, ko) => {
      setTimeout(() => {
        assert.strictEqual(invoked, 1, 'asynchronous not invoked')
        assert.ok(state.a() === 1, 'first invoked')
        ok()
      }, 5000)
    })
  }

  async asyncTestlast() {
    let invoked = 0
    let state = null
    /**
     * @type {ProxyStoreListenerThrottled}
     */
    this.proxyStore = new ProxyStoreListenerThrottledBuilder()
      .store(this.store)
      .dispatchLast()
      .build()

    this.proxyStore.listenChanged(
      b => b.callback((p) => {
        invoked++
        state = p.data()
      })
        .build()
    )

    this.store.set(
      new FakeValueObjectBuilder()
        .a(1)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(2)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(3)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(4)
        .b(20)
        .build())
    this.store.set(
      new FakeValueObjectBuilder()
        .a(5)
        .b(20)
        .build())

    this.log(invoked)

    assert.strictEqual(invoked, 0, 'synchronous invoked')

    return new Promise((ok, ko) => {
      setTimeout(() => {
        assert.strictEqual(invoked, 1, 'asynchronous not invoked')
        assert.ok(state.a() === 5, 'last invoked')
        ok()
      }, 1000)
    })
  }


}

runTest(TestProxyStoreListenerThrottledTest)
