import {TestCase} from '@flexio-oss/code-altimeter-js'
import {JsStorageStoreBuilder} from '../../js/Store/JsStorageStoreBuilder'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import {JsStorageImplStorage} from '../../js/Store/Storage/JsStorageImplStorage'
import {StoreState} from '../../js/Store/StoreState'
import '../../../generated/io/package'
import {globalFlexioImport} from '@flexio-oss/js-commons-bundle/global-import-registry/index.js'
import {Base64} from '@flexio-oss/js-commons-bundle/js-helpers/index.js'

const assert = require('assert')

const STORE_KEY = 'js-key'
const BC_KEY = 'FLX_STORE_CHANNEL'

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

  testNullStateIsCached() {
    const storage = new FakeStorage()
    const jsStorage = new JsStorageImplStorage(FakeValueObject, 'id', storage, 'null-key')

    assert.equal(jsStorage.get(), null)
    assert.equal(jsStorage.get(), null)
    assert.equal(storage.nbGets(), 1, 'Empty storage should be read once')
  }

  testStoresSharingKeyShareCache() {
    const storage = new FakeStorage()
    const storeA = buildStore(storage, 'shared-key')
    const storeB = buildStore(storage, 'shared-key')

    storeA.set(new FakeValueObjectBuilder().a(5).b(6).build())
    const lastNbGets = storage.nbGets()

    assert.equal(storeB.state().data().a(), 5, 'Should see the other store\'s value')
    assert.equal(storage.nbGets(), lastNbGets, 'Should not read storage')
    assert.equal(storeA.state().storeID(), storeA.ID())
    assert.equal(storeB.state().storeID(), storeB.ID(), 'State should carry its own store ID')
    assert.ok(storeB.state() === storeB.state(), 'State should be stable between calls')

    storeA.clean()
    assert.equal(storeB.state(), null, 'Cleaning should reset the shared cache')
  }

  testCachesAreSeparatedByStorage() {
    const storeA = buildStore(new FakeStorage(), 'separated-key')
    const storeB = buildStore(new FakeStorage(), 'separated-key')

    storeA.set(new FakeValueObjectBuilder().a(5).b(6).build())

    assert.equal(storeB.state().data(), null, 'Should not see a value set in another storage')
  }

  async asyncTestOwnChangeKeepsCache() {
    const storage = new FakeStorage()
    const store = buildStore(storage, 'own-change-key', {localStorage: storage})

    store.set(new FakeValueObjectBuilder().a(5).b(6).build())
    const lastNbGets = storage.nbGets()
    await flushMessages()

    assert.equal(store.state().data().a(), 5)
    assert.equal(storage.nbGets(), lastNbGets, 'Own change should not invalidate the cache')
    store.remove()
  }

  async asyncTestOtherTabChangeInvalidatesCache() {
    const key = 'other-tab-key'
    const storage = new FakeStorage()
    const store = buildStore(storage, key, {localStorage: storage})
    let dispatchedState = null
    store.listenChanged(builder => builder.callback((state) => dispatchedState = state).build())
    assert.equal(store.state().data(), null)

    storage.setItem(key, Base64.encode(JSON.stringify(
      new StoreState('other-store', FakeValueObject, new FakeValueObjectBuilder().a(7).b(8).build())
    )))
    postFromOtherTab(key)
    await flushMessages()

    assert.equal(store.state().data().a(), 7, 'Should read the other tab\'s value')
    assert.equal(store.state().storeID(), store.ID())
    assert.equal(dispatchedState?.data().a(), 7, 'Should dispatch the other tab\'s value')

    storage.removeItem(key)
    postFromOtherTab(key)
    await flushMessages()

    assert.equal(store.state(), null, 'Should see the other tab\'s clean')
    store.remove()
  }
}

/**
 * @param {Storage} storage
 * @param {string} key
 * @param {?Object} [window=null]
 * @return {JSStorageStore}
 */
function buildStore(storage, key, window = null) {
  const builder = new JsStorageStoreBuilder()
    .name('test-js')
    .type(FakeValueObject)
    .key(key)
  if (window === null) {
    builder.storage(storage)
  } else {
    builder.localStorage(window)
  }
  return builder.build()
}

/**
 * @param {string} key
 */
function postFromOtherTab(key) {
  const bc = new BroadcastChannel(BC_KEY)
  bc.postMessage(globalFlexioImport.io.flexio.hotballoon.types.StoreMessage.builder()
    .id('other-tab-message')
    .storageKey(key)
    .storeId('other-tab-store')
    .build()
    .toObject())
  bc.close()
}

/**
 * @return {Promise<void>}
 */
function flushMessages() {
  return new Promise((resolve) => setTimeout(resolve, 10))
}

/**
 * In-process BroadcastChannel: a real one left open by the stores handler would keep the test process alive
 */
class FakeBroadcastChannel {
  /**
   * @type {Set<FakeBroadcastChannel>}
   */
  static #channels = new Set()
  /**
   * @type {string}
   */
  #name
  /**
   * @type {?function(MessageEvent)}
   */
  onmessage = null

  /**
   * @param {string} name
   */
  constructor(name) {
    this.#name = name
    FakeBroadcastChannel.#channels.add(this)
  }

  /**
   * @param {*} data
   */
  postMessage(data) {
    FakeBroadcastChannel.#channels.forEach((channel) => {
      if (channel !== this && channel.#name === this.#name) {
        setTimeout(() => channel.onmessage?.({data}), 0)
      }
    })
  }

  close() {
    FakeBroadcastChannel.#channels.delete(this)
  }
}

globalThis.BroadcastChannel = FakeBroadcastChannel

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
