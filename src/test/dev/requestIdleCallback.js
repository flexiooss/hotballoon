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

const a = app.scheduler().requestIdleCallback(()=>{
  console.log('coucou')
})

