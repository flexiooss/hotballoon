import {ApplicationBuilder} from '../../js/Application/ApplicationBuilder'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {AsyncDomAccessor} from '../../js/View/DomAccessor'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer'
import {View} from '../../js/View/View'
import {e} from '../../js/HotballoonNodeElement/ElementDescription'

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
        )
      )
      .appendHTML(`<p>9:: insertion 4.1</p>`, `<p>10:: insertion 4.2</p>`)
      .prependHTML(`<h1>1:: insertion 5.1, version ${this.#increment}</h1>`, `<p>2:: insertion 5.2</p>`)
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
const app = new ApplicationBuilder()
  .id('html')
  .dispatcher(new Dispatcher())
  .viewDebug(true)
  .document(document)
  .navigator(navigator)
  .domAccessor(new AsyncDomAccessor(window))
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
