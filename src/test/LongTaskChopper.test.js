import { globalFlexioImport } from '@flexio-oss/js-commons-bundle/global-import-registry'
import {TestCase} from '@flexio-oss/code-altimeter-js'
import {ApplicationBuilder} from '../../ApplicationBuilder.js'

const assert = require('assert')

export class LongTaskChopperTest extends TestCase {
  debug = true

  /**
   * @return {HotBalloonApplication}
   */
  app() {
    return new ApplicationBuilder().build()
  }

  async asyncTestRunner() {
    return new Promise(async (ok, ko) => {

      /**
       * @type {HotBalloonApplication}
       */
      const app = this.app()

      /**
       * @type {Runner}
       */
      const runner = app.longTaskChopper().runner()
      let results = []
      const iterations = 25
      for (let i = 0; i < iterations; i++) {
        const res = await runner.exec(() => this.fibonacci(i))
        this.log(res, `iteration: ${i}`)
        results.push(res)
      }

      if (results.length === iterations) {
        ok()
      } else {
        ko()
      }
    })
  }

  async asyncTestMulti() {
    return new Promise(async (ok, ko) => {

      /**
       * @type {HotBalloonApplication}
       */
      const app = this.app()

      let tasks = []
      const iterations = 25
      for (let i = 0; i < iterations; i++) {
        tasks.push(
          () => this.fibonacci(i)
        )
      }

      /**
       * @type {RunnerMulti}
       */
      const runner = app.longTaskChopper().forTasks(...tasks)
      const results = await runner.exec()
      this.log(results, 'multi results')
      if (results.length === iterations) {
        ok()
      } else {
        ko()
      }
    })
  }


  /**
   * @param {number} nbr
   * @return {Promise<number>}
   */
  async fibonacci(nbr) {
    return new Promise((ok, ko) => {
      setTimeout(() => {
        ok(this.fibonacciExec(nbr ));
      }, 500)
    })
  }

  /**
   * @param {number} nbr
   * @return {number}
   */
  fibonacciExec(nbr) {
    if (nbr < 2) {
      return nbr;
    }
    return this.fibonacciExec(nbr - 1) + this.fibonacciExec(nbr - 2);
  }

}

runTest(LongTaskChopperTest)
