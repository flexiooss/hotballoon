import {BrowserApplicationBuilder} from '../../../BrowserApplicationBuilder.js'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer.js'
import {View} from '../../js/View/View.js'
import {e} from '../../js/HotballoonNodeElement/ElementDescription.js'

class ViewDemo extends View {
  /**
   * @type {number}
   */
  #increment = 0

  template() {
    this.#increment++

    return this.html(e('div#toto')
      .styles({'color': 'red'})
      .appendHTML(`<p>5:: insertion 1</p>`)
      .prependHTML(`<p>3:: insertion 2.1</p>`, `<p>4:: insertion 2.2</p>`)
      .appendHTML(`<p>6:: insertion 3.1</p>`, `<p>7:: insertion 3.2</p>`)
      .childNodes(
        this.html(e('div#tutu')
          .styles({'background-color': 'blue'})
          .text(`8:: tutu`)
          .listenEvent(b=>b.customEvent().tap(e=>{
            console.log(e)
          }))
        )
      )
      .appendHTML(`<p>9:: insertion 4.1</p>`, `<p>10:: insertion 4.2</p>`)
      .prependHTML(`<h1>1:: insertion 5.1, version ${this.#increment}</h1>`, `<p>2:: insertion 5.2</p>`)
      .reconciliationRules(r=>r.force().build())
      .properties({test: this.#increment})
      .childNodes(
        this.html(e('div#titi')
          .styles({'background-color': 'pink'})
          .text(`11:: titi`)
        )
      )
    )

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

setInterval(() => {
  viewDemo.updateNode()
}, 1000)
