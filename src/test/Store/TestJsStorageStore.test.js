import {TestCase} from '@flexio-oss/code-altimeter-js'
import {JsStorageStoreBuilder} from '../../js/Store/JsStorageStoreBuilder'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import '../../../generated/io/package'

const assert = require('assert')

const STORE_KEY = 'js-key'

export class TestJsStorageStore extends TestCase {
  setUp() {
  }

  testStoreNoDefaultValue() {
    const storage = new FakeStorage()
    const store = new JsStorageStoreBuilder()
      .name('test-js')
      .type(FakeValueObject)
      .key(STORE_KEY)
      .storage(storage)
      .build()

    assert.equal(store.state().data(), null, 'Should be null by default')

    let lastNbSets = storage.nbSets()
    store.set(new FakeValueObjectBuilder()
      .a(1)
      .b(2)
      .build())
    assert.ok(storage.nbSets() > lastNbSets)

    let lastNbGets = storage.nbGets()
    const newData = store.state().data()
    assert.equal(newData.a(), 1, 'Should be new value')
    assert.equal(storage.nbGets(), lastNbGets)
    assert.equal(storage.nbRemoves(), 0)

    store.clean()
    assert.equal(storage.nbRemoves(), 1)
  }

  testStoreWithDefaultValue() {
    const storage = new FakeStorage()
    const store = new JsStorageStoreBuilder()
      .name('test-js')
      .type(FakeValueObject)
      .key(STORE_KEY)
      .storage(storage)
      .initialData(new FakeValueObjectBuilder()
        .a(0)
        .b(1)
        .build())
      .build()

    assert.equal(store.state().data().a(), 0, 'Should have data after initialization')

    let lastNbSets = storage.nbSets()
    store.set(new FakeValueObjectBuilder()
      .a(1)
      .b(2)
      .build())
    assert.ok(storage.nbSets() > lastNbSets)

    let lastNbGets = storage.nbGets()
    const newData = store.state().data()
    assert.equal(newData.a(), 1, 'Should be new value')
    assert.equal(storage.nbGets(), lastNbGets)
    assert.equal(storage.nbRemoves(), 0)

    store.clean()
    assert.equal(storage.nbRemoves(), 1)
  }
}

/**
 *
 * @class
 * @implements {Storage}
 */
class FakeStorage {
  #data = new Map()
  #gets = 0
  #sets = 0
  #removes = 0

  length

  clear() {
    this.#data.clear()
    this.length = 0
  }

  getItem(key) {
    this.#gets++
    return this.#data.get(key) ?? null
  }

  key(index) {
    return Object.keys(this.#data)[index]
  }

  removeItem(key) {
    this.#removes++
    this.#data.delete(key)
    this.length = this.#data.size
  }

  setItem(key, value) {
    this.#sets++
    this.#data.set(key, value)
    this.length = this.#data.size
  }

  getData() {
    return this.#data
  }

  nbGets() {
    return this.#gets
  }

  nbSets() {
    return this.#sets
  }

  nbRemoves() {
    return this.#removes
  }
}

runTest(TestJsStorageStore)
