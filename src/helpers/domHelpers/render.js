export const render = (parent, child, before) => {
  parent.appendChild(child)
  // const parentEl = getEl(parent)
  // let childEl = getEl(child)

  // if (child === childEl && childEl.___hb___view) {
  //   child = childEl.___hb___view
  // }

  // if (child !== childEl) {
  //   childEl.___hb___view = child
  // }

  // const wasMounted = childEl.___hb___mounted
  // const oldParent = childEl.parentNode

  // if (wasMounted && (oldParent !== parentEl)) {
  //   doUnmount(child, childEl, oldParent)
  // }

  // if (before != null) {
  //   parentEl.insertBefore(childEl, getEl(before))
  // } else {
  //   parentEl.appendChild(childEl)
  // }

  // doMount(child, childEl, parentEl, oldParent)

  // return child
}
