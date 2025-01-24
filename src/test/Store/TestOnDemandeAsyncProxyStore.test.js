import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {AsyncProxyStoreBuilder} from '../../js/Store/AsyncProxyStoreBuilder.js'

import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import {OnDemandAsyncProxyStoreBuilder} from "../../js/Store/OnDemandAsyncProxyStoreBuilder";

const assert = require('assert')

export class TestOnDemandeAsyncProxyStore extends TestCase {
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

  // async asyncTestInit() {
  //   let invoked = 0
  //   this.proxyStore = await new OnDemandAsyncProxyStoreBuilder()
  //     .type(FakeValueObject)
  //     .store(this.store)
  //     .mapper(
  //       /**
  //        *
  //        * @param {FakeValueObject} data
  //        */
  //       async (data) => {
  //         console.log(data)
  //         invoked++
  //         return new FakeValueObjectBuilder()
  //           .a(data.a() + 1)
  //           .b(data.b() + 10)
  //           .build()
  //       })
  //     .build()
  //
  //   assert.strictEqual(invoked, 1, 'Mapper should be invoked once at init')
  //   const data = (await this.proxyStore.asyncState()).data();
  //   this.log(invoked, 'invoked')
  //   assert.strictEqual(invoked, 2, 'Mapper should be invoked on consume')
  //
  //   this.log(data, 'initial value')
  //
  //   assert.deepEqual(
  //     data,
  //     new FakeValueObjectBuilder()
  //       .a(2)
  //       .b(20)
  //       .build(),
  //     'Mapper should be invoked on consumme')
  //
  //   return true
  // }

  async asyncTestUpdateFromStoreEvent() {
    let invoked = 0

    this.proxyStore = await new OnDemandAsyncProxyStoreBuilder()
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

      this.proxyStore.listenChanged(builder => builder.callback( async (state) => {
          assert.strictEqual(invoked, 2, 'Mapper should be invoked at init and at set')
          assert.deepEqual(
            state.data(),
            new FakeValueObjectBuilder()
              .a(11)
              .b(30)
              .build(),
            'Mapper should be invoked after store update')
        let data = (await this.proxyStore.asyncState()).data()
          assert.strictEqual(invoked, 3, 'Mapper should be invoked at set')
          assert.deepEqual(
            data,
            new FakeValueObjectBuilder()
              .a(11)
              .b(30)
              .build(),
            'Mapper should be invoked on consumme')
          ok()
        }).build()
      )

      this.store.set(
        new FakeValueObjectBuilder()
          .a(10)
          .b(20)
          .build())

    })
  }


}

runTest(TestOnDemandeAsyncProxyStore)
