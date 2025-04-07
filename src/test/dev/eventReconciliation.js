import {BrowserApplicationBuilder} from '../../../BrowserApplicationBuilder.js'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher.js'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer.js'
import {View} from '../../js/View/View.js'
import {e} from '../../js/HotballoonNodeElement/ElementDescription.js'
import {UIEventBuilder} from "../../js/HotballoonNodeElement/UIEventBuilder.js";
import {shuffle} from "@flexio-oss/js-commons-bundle/js-type-helpers";
import {Throttle} from "@flexio-oss/js-commons-bundle/js-helpers/index.js";
import {RECONCILIATION_RULES} from "../../../flexio-nodes-reconciliation";

const throttle = new Throttle(1000);

class ViewDemo extends View {
  /**
   * @type {number}
   */
  #increment = 0

  template() {
    this.#increment++
    // console.log('XXX',this.#increment % 3)
    console.log(this.#increment, '_______________________________________________________________________________________________________________');

    return this.html(e('div#toto').styles({border: `solid 4px #${ Math.floor(Math.random() * 16777215).toString(16)}`})
      .childNodes(...this.button())
    )

  }

  #styles(bg) {
    return {
      cursor: 'pointer',
      padding: '2rem',
      // background: '#' + Math.floor(Math.random() * 16777215).toString(16)
      background: bg
    }
  }

  button() {
    /**
     * @type {ElementDescription}
     */
    const a = e('div#1').styles(this.#styles('red'))
      .childNodes(this.__DIV__(e=>e.text(this.#increment)))
    if (this.#increment % 3 == 1) {
      a.text('1 :: HAVE EVENT BUTTON ' + this.#increment)
      a.listenEvent(UIEventBuilder.customEvent().tap(event => {
        event.stopPropagation()
        setTimeout(() => {
          if (this.isRemoved()) return
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          Promise.resolve().then(() => {
            console.log('1 :: TAP '+this.#increment, event);
            this.updateNode();
          })
        }, 0)

      }))

      a.listenEvent(UIEventBuilder.customEvent().hold(event => {
        event.stopPropagation()
        setTimeout(() => {
          if (this.isRemoved()) return
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          Promise.resolve().then(() => {

            console.log('1 :: HOLD', event);
            this.updateNode();
          })
        }, 0)
      }))
    } else {
      a.text('1 :: WITHOUT EVENT BUTTON ' + this.#increment)
      setTimeout(() => {
        Promise.resolve().then(() => {

          this.updateNode();
        })
      }, 1000)

    }
    a.reconciliationRules(RECONCILIATION_RULES.RECONCILE_LISTENERS);


    return [this.html(a)];
  }

  buttons() {

    const a = [
      this.__DIV__(e => e.id('1').text('1 :: RR default ' + this.#increment).styles(this.#styles('red'))
        .listenEvent(UIEventBuilder.customEvent().tap(event => {
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          console.log('1 :: TAP', event);
          this.updateNode();
        }))
      ),
      this.__DIV__(e => e.id('2').text('2 :: RR bypassListeners ' + this.#increment).styles(this.#styles('yellow'))
        .listenEvent(UIEventBuilder.customEvent().tap(event => {
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          console.log('2 :: TAP', event);
          this.updateNode();
        }))
        .reconciliationRules(r => r.bypassListeners().build())
      ),
      this.__DIV__(e => e.id('3').text('3 :: RR replaceListeners ' + this.#increment).styles(this.#styles('pink'))
        .listenEvent(UIEventBuilder.customEvent().tap(event => {
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          console.log('3 :: TAP', event);
          this.updateNode();
        }))
        .reconciliationRules(r => r.replaceListeners().build())
      ),
      this.__DIV__(e => e.id('4').text('4 :: RR replace ' + this.#increment).styles(this.#styles('blue'))
        .listenEvent(UIEventBuilder.customEvent().tap(event => {
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          console.log('4 :: TAP', event);
          this.updateNode();
        }))
        .reconciliationRules(r => r.replace().build())
      ),
      this.__DIV__(e => e.id('5').text('5 :: RR reconcileListeners ' + this.#increment).styles(this.#styles('white'))
        .listenEvent(UIEventBuilder.customEvent().tap(event => {
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          console.log('5 :: TAP', event);
          this.updateNode();
        }))
        .reconciliationRules(r => r.reconcileListeners().build())
      ),
      this.__DIV__(e => e.id('6').text('6 :: RR force ' + this.#increment).styles(this.#styles('green'))
        .listenEvent(UIEventBuilder.customEvent().tap(event => {
          throttle.invokeNow(() => {
            console.log('###############################################################')
          })
          console.log('6 :: TAP', event);
          this.updateNode();
        }))
        .reconciliationRules(r => r.force().build())
      )
    ];

    return a;
    return shuffle(a);
  }
}


/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('html')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .build()

/**
 * @type {ComponentContext}
 */
const componentContext = app.addComponentContext()
/**
 * @type {ViewContainer}
 */
const viewContainer = new ViewContainer(new ViewContainerParameters(componentContext, 'container', document.body))
/**
 * @type {ViewDemo}
 */
const viewDemo = new ViewDemo(viewContainer)

viewContainer.renderAndMount()

