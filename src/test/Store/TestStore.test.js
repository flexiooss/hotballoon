import {TestCase} from 'code-altimeter-js'
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
}

runTest(TestStore)
