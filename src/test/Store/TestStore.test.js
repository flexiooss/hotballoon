import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'


const assert = require('assert')


export class TestStore extends TestCase {
  debug=true
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

  testStoreNull() {
    this.store = new InMemoryStoreBuilder()
      .build()
    this.store.set()
  }

  testReset() {
    this.store.set(new FakeValueObjectBuilder().a(0).b(0).build())
    assert.deepEqual(
      this.store.state().data(),
      new FakeValueObjectBuilder().a(0).b(0).build()
    )

    this.store.reset()
    assert.deepEqual(
      this.store.state().data(),
      new FakeValueObjectBuilder().a(1).b(10).build()
    )
  }

  testSet() {
    const valueObject = new FakeValueObjectBuilder()
      .a(0)
      .b(0)
      .build()
    this.store.set(valueObject)

    assert.deepEqual(
      this.store.state().data(),
      new FakeValueObjectBuilder().a(0).b(0).build()
    )
  }

  testListen() {
    let a = 0


    const storeHandler = this.store.listenChanged((state) => {
      console.log('CHANGED')
      a = state.data().a()
    })

    const t_1 = new FakeValueObjectBuilder()
      .a(1)
      .b(0)
      .build()

    this.store.set(t_1)

    assert.equal(a, t_1.a(), 'storeListener should be triggered')

    const t_2 = new FakeValueObjectBuilder()
      .a(2)
      .b(0)
      .build()

    this.store.set(t_2)

    assert.equal(a, t_2.a(), 'storeListener should be triggered')
    storeHandler.remove()

    const t_3 = new FakeValueObjectBuilder()
      .a(3)
      .b(0)
      .build()

    this.store.set(t_3)

    assert.equal(a, t_2.a(), 'storeListener should not be triggered')
  }


  testLastStateDispatched() {
    let count = 0

    /**
     * @type {ListenedStore}
     */
   let listened = this.store.listenChanged((state) => {
      listened.disable()
      count++
      this.log(state.data(), 'state')
      this.log(count, 'count')
      assert.equal(state.data().a(), 3, 'last value should be dispatched')
      assert.equal(count, 1, 'should be dispatched once')
    })

    this.store.onceOnUpdated((state) => {

      this.store.set(
        new FakeValueObjectBuilder()
          .a(3)
          .b(0)
          .build()
      )
    })
      .set(new FakeValueObjectBuilder()
        .a(2)
        .b(0)
        .build())
  }

  testListenWithGuard() {
    let a = 0

    /**
     * @type {ListenedStore}
     */
    const storeHandler = this.store.listenChanged((state) => {
        console.log('CHANGED')
        a = state.data().a()
      },
      100,
      payload => payload.data().a() % 2 === 0
    )

    const t_1 = new FakeValueObjectBuilder()
      .a(1)
      .b(0)
      .build()

    this.store.set(t_1)

    assert.equal(a, 0, 'storeListener should not be triggered')

    const t_2 = new FakeValueObjectBuilder()
      .a(2)
      .b(0)
      .build()

    this.store.set(t_2)

    assert.equal(a, t_2.a(), 'storeListener should be triggered')

    const t_3 = new FakeValueObjectBuilder()
      .a(3)
      .b(0)
      .build()

    this.store.set(t_3)

    assert.equal(a, t_2.a(), 'storeListener should not be triggered')
  }

}


runTest(TestStore)
