import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {AsyncProxyStoreBuilder} from '../../js/Store/AsyncProxyStoreBuilder.js'

import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'

const assert = require('assert')

export class TestAsyncProxyStore extends TestCase {
  debug = true

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

  async asyncTestUpdateFromTrig() {
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
        ok()
      })

      this.proxyStore.mapAndUpdate()

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

  async asyncTestLastChangeMappedValue() {
    let invoked = 0
    let mapperInvoked = 0

    this.proxyStore = await new AsyncProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        async (data) => {
          mapperInvoked++
          return new Promise((ok, ko) => {
            if (invoked === 1) {
              console.log('ici')
              setTimeout(() => {
                Promise.resolve().then(() => {
                  ok(new FakeValueObjectBuilder().a(1).build())
                })
              }, 2000)
            } else {
              Promise.resolve().then(() => {
                ok(new FakeValueObjectBuilder().a(10).build())
              })
            }
          })
        })
      .build()

    this.log(this.proxyStore.state().data(), 'state before parent change')
    assert.strictEqual(mapperInvoked, 1, 'Mapper should be invoked at init')

    let changed = 0
    return new Promise((ok, ko) => {
      this.proxyStore.listenChanged(() => {
        this.log(this.proxyStore.state().data(), 'state after parent change')
        changed++
        setTimeout(() => {
          assert.strictEqual(mapperInvoked, 2, 'Mapper should be invoked at init and at change')
          assert.strictEqual(changed, 1, 'only last Mapper should finish')

          assert.deepEqual(
            this.proxyStore.state().data(),
            new FakeValueObjectBuilder()
              .a(10)
              .build(),
            ' last Mapper should change and update data')

          ok()
        }, 3000)
      })

      invoked++
      this.store.trigChange()
      invoked++
      this.store.trigChange()

    })
  }

  async asyncTestAsyncInit() {
    let invoked = 0
    let mapperInvoked = 0
    this.store.listenChanged(()=>{
      invoked++
    })

    this.proxyStore = await new AsyncProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        async (data) => {
          mapperInvoked++
          return new Promise((ok, ko) => {
            setTimeout(() => {
              Promise.resolve().then(() => {
                ok(new FakeValueObjectBuilder().a(data.a() + 1).build())
              })
            }, 2000)
          })
        })
      .build()

    this.log(this.proxyStore.state().data(), 'state before parent change')
    this.log(invoked, 'store parent invoked')
    this.log(mapperInvoked, 'mapper invoked')
    assert.strictEqual(invoked, 0, 'store parent should be invoked')
    assert.strictEqual(mapperInvoked, 1, 'Mapper should be invoked at init')
    assert.deepEqual(
      this.proxyStore.state().data(),
      new FakeValueObjectBuilder()
        .a(2)
        .build(),
      ' data should map the last trig')


    return true

  }

  async asyncTestAsyncStartDiffInit() {
    let invoked = 0
    let mapperInvoked = 0
    this.store.listenChanged(()=>{
      invoked++
    })

    setTimeout(() => {
      this.store.set(
        new FakeValueObjectBuilder().a(2).build()
      )
      console.log('la')
    }, 1000)

    this.proxyStore = await new AsyncProxyStoreBuilder()
      .type(FakeValueObject)
      .store(this.store)
      .mapper(
        /**
         *
         * @param {FakeValueObject} data
         */
        async (data) => {
          mapperInvoked++
          return new Promise((ok, ko) => {
            setTimeout(() => {
              Promise.resolve().then(() => {
                ok(new FakeValueObjectBuilder().a(data.a() + 1).build())
              })
            }, 2000)
          })
        })
      .build()

    this.log(this.proxyStore.state().data(), 'state before parent change')
    this.log(invoked, 'store parent invoked')
    this.log(mapperInvoked, 'mapper invoked')
    assert.strictEqual(invoked, 1, 'store parent should be invoked')
    assert.strictEqual(mapperInvoked, 2, 'Mapper should be invoked at init')
    assert.deepEqual(
      this.proxyStore.state().data(),
      new FakeValueObjectBuilder()
        .a(3)
        .build(),
      ' data should map the last trig')

    return true
  }
}

runTest(TestAsyncProxyStore)
