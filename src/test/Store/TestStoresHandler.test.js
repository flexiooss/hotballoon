import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import {StoresHandler} from '../../js/Store/StoresHandler'

const assert = require('assert')

export class TestStoresHandler extends TestCase {
  /**
   * @type {Store<FakeValueObject, FakeValueObjectBuilder>}
   */
  #store

  /**
   * @type {StoresHandler}
   */
  #storeHandler

  setUp() {
    this.#storeHandler = new StoresHandler()

    this.#store = new InMemoryStoreBuilder()
      .type(FakeValueObject)
      .initialData(
        new FakeValueObjectBuilder()
          .a(1)
          .b(10)
          .build()
      )
      .build()
  }

  testNothing() {
    this.#storeHandler.remove()
  }

  testSyncListeners() {
    let updatesBasic = 0
    let updatesOnce = 0
    let updatesDisabled = 0
    let updatesOnceDisabled = 0

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesBasic)
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesOnce)
        .once()
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesDisabled)
        .disabled()
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesOnceDisabled)
        .once()
        .disabled()
        .build()
    )

    assert.equal(updatesBasic, 0)
    assert.equal(updatesOnce, 0)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)

    this.#store.set(new FakeValueObjectBuilder().a(2).b(20).build())
    assert.equal(updatesBasic, 1)
    assert.equal(updatesOnce, 1)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)

    this.#store.set(new FakeValueObjectBuilder().a(3).b(30).build())
    assert.equal(updatesBasic, 2)
    assert.equal(updatesOnce, 1)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)

    this.#storeHandler.remove()
    this.#store.set(new FakeValueObjectBuilder().a(4).b(40).build())
    assert.equal(updatesBasic, 2)
    assert.equal(updatesOnce, 1)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)
  }


  async asyncTestAsyncListeners() {
    let updatesBasic = 0
    let updatesOnce = 0
    let updatesDisabled = 0
    let updatesOnceDisabled = 0

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesBasic)
        .async()
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesOnce)
        .once()
        .async()
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesDisabled)
        .disabled()
        .async()
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesOnceDisabled)
        .once()
        .disabled()
        .async()
        .build()
    )

    await this.#sleep()
    assert.equal(updatesBasic, 0)
    assert.equal(updatesOnce, 0)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)

    this.#store.set(new FakeValueObjectBuilder().a(2).b(20).build())
    await this.#sleep()
    assert.equal(updatesBasic, 1)
    assert.equal(updatesOnce, 1)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)

    this.#store.set(new FakeValueObjectBuilder().a(3).b(30).build())
    await this.#sleep()
    assert.equal(updatesBasic, 2)
    assert.equal(updatesOnce, 1)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)

    this.#storeHandler.remove()
    this.#store.set(new FakeValueObjectBuilder().a(4).b(40).build())
    await this.#sleep()
    assert.equal(updatesBasic, 2)
    assert.equal(updatesOnce, 1)
    assert.equal(updatesDisabled, 0)
    assert.equal(updatesOnceDisabled, 0)
  }

  async asyncTestMixedListeners() {
    let updatesBasic = 0
    let updatesAsync = 0

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesBasic)
        .build()
    )

    this.#storeHandler.listen(
      this.#store,
      b => b
        .callback(() => ++updatesAsync)
        .async()
        .build()
    )

    await this.#sleep()
    assert.equal(updatesBasic, 0)
    assert.equal(updatesAsync, 0)

    this.#store.set(new FakeValueObjectBuilder().a(2).b(20).build())
    await this.#sleep()
    assert.equal(updatesBasic, 1)
    assert.equal(updatesAsync, 1)

    this.#store.set(new FakeValueObjectBuilder().a(3).b(30).build())
    await this.#sleep()
    assert.equal(updatesBasic, 2)
    assert.equal(updatesAsync, 2)

    this.#storeHandler.remove()
    this.#store.set(new FakeValueObjectBuilder().a(4).b(40).build())
    await this.#sleep()
    assert.equal(updatesBasic, 2)
    assert.equal(updatesAsync, 2)
  }

  async #sleep() {
    return new Promise(resolve => setTimeout(resolve, 100))
  }
}

runTest(TestStoresHandler)
