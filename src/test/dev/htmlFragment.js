import {BrowserApplicationBuilder} from '../../../BrowserApplicationBuilder.js'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer.js'
import {View} from '../../js/View/View.js'
import {e} from '../../js/HotballoonNodeElement/ElementDescription.js'
import {ViewFragment} from "../../js/View/ViewFragment.js";
import {RECONCILIATION_RULES} from "../../../flexio-nodes-reconciliation/index.js";

class ViewDemo extends View {


  constructor(container) {
    super(container);
    this.setSynchronousRender()
  }

  template() {

    return this.__DIV__(e => e.id('main'))

  }
}

class ViewFragmentDemo extends ViewFragment {
  /**
   * @type {number}
   */
  #increment = 0

  constructor(container) {
    super(container);
    this.setSynchronous()
  }

  template() {
    const list = ViewFragment.NodeArray()
    this.#increment++

    if (this.#increment <= 15) {
      if (this.#increment % 2 === 0) {
        for (let i = (this.#increment ); i >= 0; i--) {
          list.push(
            this.__DIV__(e => e.id(`item-${i}`).text(`item ${i}`).reconciliationRules(RECONCILIATION_RULES.BYPASS_CHILDREN))
          )
        }
      } else {
        for (let i = 0; i <= this.#increment; i++) {
          list.push(
            this.__DIV__(e => e.id(`item-${i}`).text(`item ${i}`).reconciliationRules(RECONCILIATION_RULES.BYPASS_CHILDREN))
          )
        }
      }
    } else if (this.#increment > 25) {
      for (let i = 0; i <= this.#increment; i++) {
        list.push(
          this.__DIV__(e => e.id(`item-t-${i}`).text(`item TER ${i}`))
        )
      }
    } else if (this.#increment > 20) {
      return null
    } else {
      for (let i = 0; i <= this.#increment; i++) {
        list.push(
          this.__DIV__(e => e.id(`item-b-${i}`).text(`item BIS ${i}`))
        )
      }
    }
    return list
  }
}


/**
 * @type {HotBalloonApplication}
 */
const app = new BrowserApplicationBuilder()
  .id('html')
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
/**
 * @type {ViewContainer}
 */
const viewContainer2 = new ViewContainer(new ViewContainerParameters(componentContext, 'container2', viewDemo.nodeRef('main')))
/**
 * @type {ViewFragmentDemo}
 */
const viewFragmentDemo = new ViewFragmentDemo(viewContainer2)

viewContainer2.renderAndMount()

// setInterval(() => {
//   viewFragmentDemo.updateNode()
// }, 1000)
const button = document.createElement('button')
button.onclick = () => {
  viewFragmentDemo.updateNode()
}
button.innerText = 'UPDATE'
document.body.insertAdjacentElement('afterbegin', button)
const button_delete = document.createElement('button')
button_delete.onclick = () => {
  componentContext.remove()
}
button_delete.innerText = 'REMOVE'
document.body.insertAdjacentElement('afterbegin', button_delete)

viewFragmentDemo.nodeRef('item-1').insertAdjacentHTML('beforeend', '<div style="color: red">coucou</div>')