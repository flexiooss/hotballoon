import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {ProxyStoreBuilder} from '../../js/Store/ProxyStoreBuilder.js'

import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'

const assert = require('assert')

export class TestProxyStore extends TestCase {
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
    this.proxyStore = new ProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        (data) => {
          invoked++
          return new FakeValueObjectBuilder()
            .a(data.a() + 1)
            .b(data.b() + 10)
            .build()
        })
      .build()

    assert.strictEqual(invoked, 1, 'Mapper should be invoked once at init')

    assert.deepEqual(
      this.proxyStore.state().data(),
      new FakeValueObjectBuilder()
        .a(2)
        .b(20)
        .build(),
      'Mapper should be invoked at init')
  }

  testUpdateFromStoreEvent() {
    let invoked = 0

    this.proxyStore = new ProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        (data) => {
          invoked++

          return new FakeValueObjectBuilder()
            .a(data.a() + 1)
            .b(data.b() + 10)
            .build()
        })
      .build()

    this.store.set(
      new FakeValueObjectBuilder()
        .a(10)
        .b(20)
        .build())

    assert.strictEqual(invoked, 2, 'Mapper should be invoked at init and at set')
    assert.deepEqual(
      this.proxyStore.state().data(),
      new FakeValueObjectBuilder()
        .a(11)
        .b(30)
        .build(),
      'Mapper should be invoked after store update')
  }

  testUpdateFromTrig() {
    let invoked = 0

    this.proxyStore = new ProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        (data) => {
          invoked++

          return new FakeValueObjectBuilder()
            .a(data.a() + 1)
            .b(data.b() + 10)
            .build()
        })
      .build()

    this.proxyStore.mapAndUpdate()
    assert.strictEqual(invoked, 2, 'Mapper should be invoked at init and at set')
  }

  testChangeParentStore() {
    let invoked = 0
    const store2 = new InMemoryStoreBuilder()
      .type(FakeValueObject)
      .initialData(
        new FakeValueObjectBuilder()
          .a(10000)
          .b(10000)
          .build()
      )
      .build()

    this.proxyStore = new ProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        (data) => {
          invoked++

          return new FakeValueObjectBuilder()
            .a(data.a() + 1)
            .b(data.b() + 10)
            .build()
        })
      .build()

    this.log(this.proxyStore.state().data(), 'state before parent change')
    assert.strictEqual(invoked, 1, 'Mapper should be invoked at init')
    this.proxyStore.changeParentStore(store2)
    this.log(this.proxyStore.state().data(), 'state after parent change')
    assert.strictEqual(invoked, 2, 'Mapper should be invoked at init and at change')

    assert.deepEqual(
      this.proxyStore.state().data(),
      new FakeValueObjectBuilder()
        .a(10001)
        .b(10010)
        .build(),
      'ParentStore should be changed and data updated')
  }
}

runTest(TestProxyStore)
