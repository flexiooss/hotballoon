import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {AsyncProxyStoreBuilder} from '../../js/Store/AsyncProxyStoreBuilder.js'

import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'

const assert = require('assert')

export class TestAsyncProxyStore extends TestCase {
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

  async asyncTestInit() {
    let invoked = 0
    this.proxyStore = await new AsyncProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        async (data) => {
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

    return true
  }

  async asyncTestUpdateFromStoreEvent() {
    let invoked = 0

    this.proxyStore = await new AsyncProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        async (data) => {
          invoked++

          return new FakeValueObjectBuilder()
            .a(data.a() + 1)
            .b(data.b() + 10)
            .build()
        })
      .build()
    return new Promise((ok, ko) => {

      this.proxyStore.listenChanged(() => {

        assert.strictEqual(invoked, 2, 'Mapper should be invoked at init and at set')
        assert.deepEqual(
          this.proxyStore.state().data(),
          new FakeValueObjectBuilder()
            .a(11)
            .b(30)
            .build(),
          'Mapper should be invoked after store update')
        ok()
      })

      this.store.set(
        new FakeValueObjectBuilder()
          .a(10)
          .b(20)
          .build())

    })
  }

  async asyncTestChangeParentStore() {
    let invoked = 0
    const store2 = await new InMemoryStoreBuilder()
      .type(FakeValueObject)
      .initialData(
        new FakeValueObjectBuilder()
          .a(10000)
          .b(10000)
          .build()
      )
      .build()

    this.proxyStore = await new AsyncProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        async (data) => {
          invoked++

          return new FakeValueObjectBuilder()
            .a(data.a() + 1)
            .b(data.b() + 10)
            .build()
        })
      .build()

    this.log(this.proxyStore.state().data(), 'state before parent change')
    assert.strictEqual(invoked, 1, 'Mapper should be invoked at init')

    return new Promise((ok, ko) => {
      this.proxyStore.listenChanged(() => {
        this.log(this.proxyStore.state().data(), 'state after parent change')
        assert.strictEqual(invoked, 2, 'Mapper should be invoked at init and at change')

        assert.deepEqual(
          this.proxyStore.state().data(),
          new FakeValueObjectBuilder()
            .a(10001)
            .b(10010)
            .build(),
          'ParentStore should be changed and data updated')
        ok()
      })

      this.proxyStore.changeParentStore(store2)

    })
  }
}

runTest(TestAsyncProxyStore)
