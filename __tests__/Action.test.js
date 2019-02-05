import {Action} from '../src/Action/Action'
import {Dispatcher} from '../src/Dispatcher/Dispatcher'

test('should throw if construct without dispatcher and componentId', () => {
  expect(() => {
    new Action()
  }).toThrow()
})

test('should throw if construct with dispatcher and without componentId', () => {
  expect(() => {
    new Action(new Dispatcher())
  }).toThrow()
})

test('should throw if construct with dispatcher and with componentId without override `_registerActions`', () => {
  expect(() => {
    new Action(new Dispatcher(), 'myId')
  }).toThrow()
})
