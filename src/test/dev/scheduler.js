import {Dispatcher} from "../../js/Dispatcher/Dispatcher.js";
import {BrowserApplicationBuilder} from "../../../BrowserApplicationBuilder.js";

/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('scheduler')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .build()

const start = performance.now();

app.scheduler().postTask(() => {
  console.log('BACKGROUND DELAY', performance.now() - start)
}).background().delay(1000).build().exec()

const a = app.scheduler().postTask(() => '1 => 1').blocking().build()
a.exec().then(r => {
  console.log(r)
})

app.scheduler().postTask(() => '2 => 6').background().build().exec().then(r => {
  console.log(r)
})
/**
 * @type {HBTask}
 */
const changed = app.scheduler().postTask(() => '3 => 3 [changed]').background().build()

changed.exec().then(r => {
  console.log(r)
})
app.scheduler().postTask(() => '4 => 4').build().exec().then(r => {
  console.log(r)
})
app.scheduler().postTask(() => '5 => 2 ').blocking().build().exec().then(r => {
  console.log(r)
})
changed.toPriorityNormal()

const never = app.scheduler().postTask(() => 'NEVER').background().build()
never.exec()
  .then(r => {
    console.log(r)
  })
  .catch(e => {
    console.error('catched error ::')
    console.error(e)
  })

never.abort()

app.scheduler().postTask(() => '6 => 5').build().exec().then(r => {
  console.log(r)
})

setTimeout(() => {
  console.log('do nothing')
  a.abort()
}, 1000)

