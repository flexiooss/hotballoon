import {TestCase} from '@flexio-oss/code-altimeter-js'
import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject'


const assert = require('assert')


export class TestStore extends TestCase {
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

    this.store.listenChanged((state) => {
      count++
      assert.equal(state.data().a(), 3, 'last value should be dispatched')
      assert.equal(count, 1, 'should be dispatched once')
    })

    this.store.onceOnUpdated((state)=>{

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
}


runTest(TestStore)
