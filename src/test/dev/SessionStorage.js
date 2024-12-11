import {JsStorageStoreBuilder} from "../../js/Store/JsStorageStoreBuilder.js";
import {Layer} from "./LayerFixture.js";
import {UIDMini} from '@flexio-oss/js-commons-bundle/js-helpers/index.js';
import {BrowserApplicationBuilder} from "../../../BrowserApplicationBuilder.js";
import {globalFlexioImport} from "@flexio-oss/js-commons-bundle/global-import-registry/index.js";

/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('storage')
  .viewDebug(true)
  .document(document)
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

/**
 * @type {Store<Layer, LayerBuilder>}
 */
const localStorage2 = new JsStorageStoreBuilder()
  .name('test-localStorage-2')
  .key('MY_DATA-loc')
  .type(Layer)
  .localStorage(app.viewRenderConfig().document().defaultView)
  .initialData(Layer.builder().id('test').show(true).build())
  .build()

sessionStorage.listenChanged(b=>b.callback(state => {
  console.log('SESSION STORAGE CHANGE')
  console.log(state)
}).build())

localStorage.listenChanged(b=>b.callback(state => {
  console.log('LOCAL STORAGE CHANGE')
  console.log(state)
}).build())

localStorage2.listenChanged(b=>b.callback(state => {
  console.log('LOCAL STORAGE  2 CHANGE')
  console.log(state)
}).build())

globalThis.__session = function () {
  sessionStorage.set(Layer.builder().id('test').collection(UIDMini()).show(true).build())
}


globalThis.__sessionObjectValue = function () {
  sessionStorageObjectValue.set(globalFlexioImport.io.flexio.flex_types.ObjectValue.fromObject(
    {
      test: 12,
      sub: {
        patati: UIDMini('gen-'),
        "pata-ta": {
          truc: "moche"
        }
      }
    }
  ).build())
  sessionStorageObjectValue.remove()
}

globalThis.__sessionObjectValueClean = function () {
  sessionStorageObjectValue.reset()
}

globalThis.__local = function () {
  localStorage.set(Layer.builder().id('test').collection(UIDMini()).show(true).build())
}

globalThis.__removeLocal = function () {
  localStorage.remove()
}


/**
 * @type {Store<Layer, LayerBuilder>}
 */
const sessionStorageObjectValue = new JsStorageStoreBuilder()
  .name('test-session')
  .key('OBJECTVALUE-sess')
  .type(globalFlexioImport.io.flexio.flex_types.ObjectValue)
  .sessionStorage(app.viewRenderConfig().document().defaultView)
  .initialData(null)
  .build()

document.body.insertAdjacentHTML('afterbegin',
  `
<button onclick="__session();">session +</button>
<button onclick="__sessionObjectValueClean();">clean session objectValue+</button>
<button onclick="__sessionObjectValue();">session objectValue+</button>
<button onclick="__local();">local storage +</button>
<button onclick="__removeLocal();">remove local storage +</button>
  `
)