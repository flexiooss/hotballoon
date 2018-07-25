import {EventHandlerBase} from '../src/Event/EventHandlerBase'

test('should handle EventListeners registration', () => {
  const EventHandlerBaseInstance = new EventHandlerBase()
  const token = EventHandlerBaseInstance.addEventListener('test', (payload) => payload)
  expect(EventHandlerBaseInstance.hasEventListener('test', token)).toBeTruthy()
  expect(EventHandlerBaseInstance.hasEventListener('test', 'fakeToken')).toBeFalsy()
  expect(EventHandlerBaseInstance.hasEventListener('otherTest', token)).toBeFalsy()
})

test('should handle EventListeners suppression', () => {
  const EventHandlerBaseInstance = new EventHandlerBase()
  const token = EventHandlerBaseInstance.addEventListener('test', (payload) => payload)

  expect.anything(() => {
    EventHandlerBaseInstance.removeEventListener('otherTest', token)
  })

  expect(() => {
    EventHandlerBaseInstance.removeEventListener('test', 'fakeToken')
  }).toThrow()

  EventHandlerBaseInstance.removeEventListener('test', token)
  expect(EventHandlerBaseInstance.hasEventListener('test', token)).toBeFalsy()
})
