if(typeof global.Event ===  'undefined'){
  global.Event = class {}
}
if(typeof global.AbortController ===  'undefined'){
  global.AbortController = class {}
}
if(typeof global.self ===  'undefined'){
  global.self = global
}
if (typeof global.atob === 'undefined') {
  global.atob = (str) => {
    return Buffer.from(str, 'base64').toString()
  }
}

if (typeof global.btoa === 'undefined') {
  global.btoa = (str) => {
    return Buffer.from(str).toString('base64')
  }
}
export class FakeDocument {
  /**
   * @type {string}
   */
  #cookie = ''

  get defaultView(){
    return {
      nevigator:{}
    }
  }
  get cookie() {
    return this.#cookie
  }

  set cookie(value) {
    if ('' !== this.#cookie) {
      this.#cookie += '; ' + value
    } else {
      this.#cookie += value
    }
  }


  addEventListener() {
    console.log('FakeDocument:addEventListener')
  }

  adoptNode() {
  }

  append() {
  }

  caretRangeFromPoint() {
  }

  clear() {
  }

  close() {
  }

  createAttribute() {
  }

  createCDATASection() {
  }

  createComment() {
  }

  createDocumentFragment() {
  }

  createElement() {
  }

  createElementNS() {
  }

  createEntityReference() {
  }

  createEvent() {
  }

  createExpression() {
  }

  createNodeIterator() {
  }

  createNSResolver() {
  }

  createProcessingInstruction() {
  }

  createRange() {
  }

  createTextNode() {
  }

  createTouch() {
  }

  createTouchList() {
  }

  createTreeWalker() {
  }

  enableStyleSheetsForSet() {
  }

  evaluate() {
  }

  execCommand() {
  }

  exitFullscreen() {
  }

  exitPointerLock() {
  }

  getAnimations() {
  }

  getBoxObjectFor() {
  }

  getElementById() {
  }

  getElementsByClassName() {
  }

  getElementsByName() {
  }

  getElementsByTagName() {
  }

  getElementsByTagNameNS() {
  }

  hasFocus() {
  }

  hasStorageAccess() {
  }

  importNode() {
  }

  mozSetImageElement() {
  }

  open() {
  }

  prepend() {
  }

  queryCommandEnabled() {
  }

  queryCommandSupported() {
  }

  querySelector() {
  }

  querySelectorAll() {
  }

  registerElement() {
  }

  releaseCapture() {
  }

  requestStorageAccess() {
  }

  write() {
  }

  writeln() {
  }
}
