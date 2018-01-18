import {
  el as RedomEl,
  mount as RedomMount
} from 'redom'

class DomHandler {
  static createElement(tagName, options) {
    return RedomEl(tagName, options)
  }
  static appendChild(parentElement, childElement) {
    RedomMount(parentElement, childElement)
  }
}

export {
  DomHandler
}
