import {EventHandlerBase} from '../src/js/Event/EventHandlerBase'
import {EventListenerFactory} from '../src/js/Event/EventListenerFactory'
import {sleep} from 'flexio-jshelpers'

test('should handle EventListeners registration', () => {
  const EventHandlerBaseInstance = new EventHandlerBase()
  const token = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => payload)
      .build()
  )
  expect(EventHandlerBaseInstance.hasEventListener('test', token)).toBeTruthy()
  expect(EventHandlerBaseInstance.hasEventListener('test', 'fakeToken')).toBeFalsy()
  expect(EventHandlerBaseInstance.hasEventListener('otherTest', token)).toBeFalsy()
})

test('should handle EventListeners suppression', () => {
  const EventHandlerBaseInstance = new EventHandlerBase()
  const token = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => payload)
      .build()
  )
  expect.anything(() => {
    EventHandlerBaseInstance.removeEventListener('otherTest', token)
  })

  expect(() => {
    EventHandlerBaseInstance.removeEventListener('test', 'fakeToken')
  }).toThrow()

  EventHandlerBaseInstance.removeEventListener('test', token)
  expect(EventHandlerBaseInstance.hasEventListener('test', token)).toBeFalsy()
})

test('should handle event basically', () => {
  const track = {
    clb1: null,
    clb2: null,
    clb3: null
  }

  const clb1 = jest.fn()

  const EventHandlerBaseInstance = new EventHandlerBase()
  const token = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback(clb1)
      .build()
  )

  const token1 = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => {
        track.clb1 = payload
      })
      .build()
  )

  const token2 = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => {
        track.clb2 = payload
      })
      .build()
  )

  const token3 = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('otherTest')
      .callback((payload) => {
        console.log(payload)
        track.clb3 = payload
      })
      .build()
  )

  // console.log(EventHandlerBaseInstance)
  // console.log(EventHandlerBaseInstance._listeners.get('test'))

  expect(track.clb1).toBeNull()
  expect(track.clb2).toBeNull()
  expect(track.clb3).toBeNull()

  const testVal1 = 'testValue'
  expect.anything(() => {
    EventHandlerBaseInstance.dispatch('test', testVal1)
  })

  EventHandlerBaseInstance.dispatch('test', testVal1)
  expect(clb1).toHaveBeenCalled()
  expect(track.clb1).toBe(testVal1)
  expect(track.clb2).toBe(testVal1)
  expect(track.clb3).toBeNull()
})

test('should handle long event and error', (done) => {
  const track = {
    clb: 0,
    clb1: 0,
    clb2: 0,
    clb3: 0
  }

  const EventHandlerBaseInstance = new EventHandlerBase()
  const token = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => {
        track.clb += payload
      })
      .build()
  )

  const token1 = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => {
        setTimeout(() => {
          track.clb1 += payload
          done()
        }, 4000)
      })
      .build()
  )

  const token2 = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('test')
      .callback((payload) => {
        throw Error('Test Callback throw Error Failed')
      })
      .build()
  )

  const token3 = EventHandlerBaseInstance.addEventListener(
    EventListenerFactory.listen('otherTest')
      .callback((payload) => {
        console.log(payload)
        track.clb3 += payload
      })
      .build()
  )

  expect(track.clb).toEqual(0)
  expect(track.clb1).toEqual(0)
  expect(track.clb2).toEqual(0)
  expect(track.clb3).toEqual(0)

  const testVal1 = 2
  EventHandlerBaseInstance.dispatch('test', testVal1)

  expect(track.clb).toBe(testVal1)
  expect(track.clb2).not.toBe(testVal1)
  expect(track.clb3).toEqual(0)

  setTimeout(() => {
    expect(track.clb1).toBe(testVal1)
    done()
  }, 4001)

  EventHandlerBaseInstance.dispatch('test', testVal1)

  const res2 = testVal1 * 2
  expect(track.clb).toBe(res2)
  expect(track.clb2).not.toBe(res2)
  expect(track.clb3).toEqual(0)

  setTimeout(() => {
    expect(track.clb1).toBe(res2)
    done()
  }, 4001)
})
