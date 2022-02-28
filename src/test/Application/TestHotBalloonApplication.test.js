import {TestCase} from '@flexio-oss/code-altimeter-js'
import {HotBalloonApplication} from '../../js/Application/HotBalloonApplication'
import {ApplicationBuilder} from '../../js/Application/ApplicationBuilder'


const assert = require('assert')


export class TestHotBalloonApplication extends TestCase {
  /**
   * @return {HotBalloonApplication}
   */
  app() {
    return new ApplicationBuilder()
      .build()
  }

  setUp() {
    this.APP = this.app()
    this.dispatcher = this.APP.dispatcher()
  }

}


runTest(TestHotBalloonApplication)
