import {ApplicationBuilder} from "../../js/Application/ApplicationBuilder";
import {Dispatcher} from "../../js/Dispatcher/Dispatcher";
import {AsyncDomAccessor} from "../../js/View/DomAccessor";

/**
 * @type {HotBalloonApplication}
 */
const app = new ApplicationBuilder()
  .id('scheduler')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .navigator(navigator)
  .domAccessor(new AsyncDomAccessor(window))
  .build()

app.scheduler().postTask().task(() => '1 => 1').blocking().build().exec().then(r => {
  console.log(r)
})
app.scheduler().postTask().task(() => '2 => 4').background().build().exec().then(r => {
  console.log(r)
})
app.scheduler().postTask().task(() => '3 => 2 ').blocking().build().exec().then(r => {
  console.log(r)
})

const never = app.scheduler().postTask().task(() => 'NEVER').background().build()
never.exec()
  .then(r => {
    console.log(r)
  })
  .catch(e=>{
    console.error(e)
  })

never.abort()

app.scheduler().postTask().task(() => '5 => 3').build().exec().then(r => {
  console.log(r)
})

