import {Action} from '../src/Action'
import {Dispatcher} from '../src/Event/Dispatcher'

test('should throw if construct without Dispatcher and componentId', () => {
  expect(() => {
    new Action()
  }).toThrow()
})

test('should throw if construct with Dispatcher and without componentId', () => {
  expect(() => {
    new Action(new Dispatcher())
  }).toThrow()
})

test('should throw if construct with Dispatcher and with componentId without override `_registerActions`', () => {
  expect(() => {
    new Action(new Dispatcher(), 'myId')
  }).toThrow()
})
