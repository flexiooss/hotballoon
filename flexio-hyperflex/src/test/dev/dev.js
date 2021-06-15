import '../../../generated/io/package'
import {html} from '../../js/HyperFlex'
import {HyperFlexParams} from '../../js/HyperFlexParams'

const a = html('div#toto',
  HyperFlexParams
    .withStyles({'color': 'red'})
    .appendHTML(`<p>5:: insertion 1</p>`)
    .prependHTML(`<p>3:: insertion 2.1</p>`, `<p>4:: insertion 2.2</p>`)
    .appendHTML(`<p>6:: insertion 3.1</p>`, `<p>7:: insertion 3.2</p>`)
    .addChildNodes([html('div#tutu',
      HyperFlexParams
        .withStyles({'background-color': 'blue'})
        .addText(`8:: tutu`),
      window.document
    )])
    .appendHTML(`<p>9:: insertion 4.1</p>`, `<p>10:: insertion 4.2</p>`)
    .prependHTML(`<p>1:: insertion 5.1</p>`, `<p>2:: insertion 5.2</p>`)
    .addChildNodes([html('div#titi',
      HyperFlexParams
        .withStyles({'background-color': 'pink'})
        .addText(`11 :: titi`),
      window.document
    )]),
  window.document
)

document.body.appendChild(a)
