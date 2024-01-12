import {InMemoryStoreBuilder} from '../../js/Store/InMemoryStoreBuilder.js'
import {FakeValueObject, FakeValueObjectBuilder} from '../FakeValueObject.js'
import {ProxyStoreListenerThrottledBuilder} from '../../js/Store/ProxyStoreListenerThrottled.js'

const store = new InMemoryStoreBuilder()
  .type(FakeValueObject)
  .initialData(
    new FakeValueObjectBuilder()
      .a(1)
      .b(10)
      .build()
  )
  .build()

let invoked = 0
let state = null
/**
 * @type {ProxyStoreListenerThrottled}
 */
const proxyStore = new ProxyStoreListenerThrottledBuilder()
  .store(store)
  .timeToThrottle(300)
  .build()

proxyStore.listenChanged(
  b => b.callback((p) => {

    invoked++
    state = p.data()
    console.log(invoked, state)

  })
    .build()
)

document.body.innerHTML = '<button id="button">click</button>'
const button = document.getElementById('button')
button.addEventListener('click', () => {
  store.set(
    new FakeValueObjectBuilder()
      .a(1)
      .b(20)
      .build())
  store.set(
    new FakeValueObjectBuilder()
      .a(5)
      .b(20)
      .build())
})
