import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'

const assert = require('assert')

export class TestHotBalloonApplication extends TestCase {
  setUp() {
    this.dispatcher = new Dispatcher()
    this.APP = new HotBalloonApplication('id', this.dispatcher)
  }

  testAddComponentContext() {
    const componentContext = this.APP.addComponentContext()
    assert(this.APP.componentContext(componentContext.ID) === componentContext)
  }

  /* testRemoveComponentContext() {
    const componentContext = this.APP.addComponentContext()
    this.APP.removeComponentContext(componentContext.ID)
    assert(this.APP.componentContext(componentContext.ID) === undefined)
  } */
}

runTest(TestHotBalloonApplication)
