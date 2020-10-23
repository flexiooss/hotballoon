import {TestCase} from 'code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {FakeLogger} from '@flexio-oss/js-commons-bundle/js-logger'
import {ViewRenderConfig} from '../../js/Application/ViewRenderConfig'
import {SyncDomAccessor} from '../../js/View/DomAccessor'


const assert = require('assert')


export class TestHotBalloonApplication extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app() {
    return new HotBalloonApplication('id', new Dispatcher(new FakeLogger()), new FakeLogger().debug(), new ViewRenderConfig(null, false, new SyncDomAccessor()))
  }

  setUp() {
    this.dispatcher = new Dispatcher(new FakeLogger())
    this.APP = this.app()
  }

  testAddComponentContext() {
    const componentContext = this.APP.addComponentContext()
    assert.deepStrictEqual(this.APP.componentContext(componentContext.ID()), componentContext)
  }

  /* testRemoveComponentContext() {
    const componentContext = this.APP.addComponentContext()
    this.APP.removeComponentContext(componentContext.ID)
    assert(this.APP.componentContext(componentContext.ID) === undefined)
  } */
}


runTest(TestHotBalloonApplication)
