import {ApplicationBuilder} from '../../js/Application/ApplicationBuilder'
import {Dispatcher} from '../../js/Dispatcher/Dispatcher'
import {AsyncDomAccessor} from '../../js/View/DomAccessor'
import {ViewContainer, ViewContainerParameters} from '../../js/View/ViewContainer'
import {View} from '../../js/View/View'
import {e} from '../../js/HotballoonNodeElement/ElementDescription'
import {UIEventBuilder} from "../../js/HotballoonNodeElement/UIEventBuilder";

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
        ),
        this.__DIV__(e => e.text('HOLD TAP DOUBLE_TAP ' + this.#increment).styles({padding: '2rem'})
          .listenEvent(UIEventBuilder.customEvent().hold(event => {
              console.log('HOLD', event)
            })
          )
          .listenEvent(UIEventBuilder.customEvent().doubleTap(event => {
              console.log('DOUBLE_TAP', event)
            })
          )
          .listenEvent(UIEventBuilder.customEvent().tap(event => {
              console.log('TAP', event)
            })
          )
        ),
        this.__DIV__(e => e.text('HOLD TAP ' + this.#increment).styles({padding: '2rem'})
          .listenEvent(UIEventBuilder.customEvent().hold(event => {
              console.log('HOLD', event)
            })
          )
          .listenEvent(UIEventBuilder.customEvent().tap(event => {
              console.log('TAP', event.detail.source)
            })
          )
          .childNodes(
            this.__DIV__(e => e.text('inside 1 ').styles({padding: '2rem', background: 'cyan'})),
            this.__DIV__(e => e.text('inside 2 ').styles({padding: '2rem', background: 'blue'}),
            )
          )
        ),
        this.__DIV__(e => e.text('HOLD ' + this.#increment).styles({padding: '2rem'})
          .listenEvent(UIEventBuilder.customEvent().hold(event => {
              console.log('HOLD', event)
            })
          )
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

// setInterval(() => {
//   viewDemo.updateNode()
// }, 1000)