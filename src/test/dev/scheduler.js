import {Dispatcher} from "../../js/Dispatcher/Dispatcher";
import {BrowserApplicationBuilder} from "../../../BrowserApplicationBuilder";

/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('scheduler')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .build()

app.scheduler().postTask(() => '1 => 1').blocking().build().exec().then(r => {
  console.log(r)
})
app.scheduler().postTask(() => '2 => 4').background().build().exec().then(r => {
  console.log(r)
})
app.scheduler().postTask(() => '3 => 2 ').blocking().build().exec().then(r => {
  console.log(r)
})

const never = app.scheduler().postTask(() => 'NEVER').background().build()
never.exec()
  .then(r => {
    console.log(r)
  })
  .catch(e => {
    console.error(e)
  })

never.abort()

app.scheduler().postTask(() => '5 => 3').build().exec().then(r => {
  console.log(r)
})

