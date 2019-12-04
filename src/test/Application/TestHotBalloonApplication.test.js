import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {FakeLogger} from '@flexio-oss/js-logger'

const assert = require('assert')

export class TestHotBalloonApplication extends TestCase {
  setUp() {
    this.dispatcher = new Dispatcher(new FakeLogger())
    this.APP = new HotBalloonApplication('id', this.dispatcher, new FakeLogger().debug())
  }

  testAddComponentContext() {
    const componentContext = this.APP.addComponentContext()
    assert(this.APP.componentContext(componentContext.ID()) === componentContext)
  }

  /* testRemoveComponentContext() {
    const componentContext = this.APP.addComponentContext()
    this.APP.removeComponentContext(componentContext.ID)
    assert(this.APP.componentContext(componentContext.ID) === undefined)
  } */
}

runTest(TestHotBalloonApplication)
