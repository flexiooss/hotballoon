import {ApplicationBuilder} from "../../js/Application/ApplicationBuilder";
import {Dispatcher} from "../../js/Dispatcher/Dispatcher";
import {AsyncDomAccessor} from "../../js/View/DomAccessor";
import {JsStorageStoreBuilder} from "../../js/Store/JsStorageStoreBuilder";
import {Layer} from "./LayerFixture";
import {UIDMini} from "@flexio-oss/js-commons-bundle/js-helpers";

/**
 * @type {HotBalloonApplication}
 */
const app = new ApplicationBuilder()
  .id('storage')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .navigator(navigator)
  .domAccessor(new AsyncDomAccessor(window))
  .build()

/**
 * @type {Store<Layer, LayerBuilder>}
 */
const sessionStorage = new JsStorageStoreBuilder()
  .name('test-session')
  .key('MY_DATA-sess')
  .type(Layer)
  .sessionStorage(app.viewRenderConfig().document().defaultView)
  .initialData(Layer.builder().id('test').show(true).build())
  .build()

/**
 * @type {Store<Layer, LayerBuilder>}
 */
const localStorage = new JsStorageStoreBuilder()
  .name('test-localStorage')
  .key('MY_DATA-loc')
  .type(Layer)
  .localStorage(app.viewRenderConfig().document().defaultView)
  .initialData(Layer.builder().id('test').show(true).build())
  .build()

sessionStorage.listenChanged(state=>{
  console.log('SESSION STORAGE CHANGE')
  console.log(state)
})

localStorage.listenChanged(state=>{
  console.log('LOCAL STORAGE CHANGE')
  console.log(state)
})

globalThis.__session =  function (){
  sessionStorage.set(Layer.builder().id('test').collection(UIDMini()).show(true).build())
}

globalThis.__local = function (){
  localStorage.set(Layer.builder().id('test').collection(UIDMini()).show(true).build())
}

globalThis.__removeLocal = function (){
  localStorage.remove()
}

document.body.insertAdjacentHTML('afterbegin',
  `
<button onclick="__session();">session +</button>
<button onclick="__local();">local storage +</button>
<button onclick="__removeLocal();">remove local storage +</button>
  `
  )