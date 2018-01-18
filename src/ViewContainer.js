// import {
//   shouldIs
// } from './shouldIs'
import {
  View
} from './View'
import {
  InstancesMap
} from './InstancesMap'

class ViewContainer {
  constructor() {
    this.storesName = []
    this._viewContainers = new InstancesMap(ViewContainer)
    this._views = new InstancesMap(View)
    this._mounted = false
    this._rendered = false
  }

  subscribeToStores(stores) {}

  init(stores) {
    let myStores = Object.keys(stores)
      .filter(key => this.storesName.includes(key))
      .reduce((obj, key) => {
        obj[key] = stores[key]
        return obj
      }, {})

    this.subscribeToStores(myStores)
    this.mount()
  }

  addViewContainer(viewContainer) {
    this._viewContainers.add(viewContainer)
  }
  addView(view) {
    this._views.add(view)
  }

  registerContainers() {}

  registerViews() {}

  mount() {
    this.registerContainers()
    this.registerViews()
    this._mounted = true
  }

  _renderContainer(parentNode) {
    // for (let container in this.viewContainers.get()) {
    //   this.viewContainers.get(container).render(parentNode)
    // }
    this._viewContainers.foreach((key, value) => {
      value.render(parentNode)
    })
  }

  _renderViews(parentNode) {
    this._views.foreach((key, value) => {
      value.render(parentNode)
    })
    // for (let view in this.views.get()) {
    //   this.views.get(view).render(parentNode)
    // }
  }

  render(parentNode) {
    if (!this._mounted) {
      this.mount()
    }
    this._renderContainer(parentNode)
    this._renderViews(parentNode)
    this._rendered = true
  }
}

export {
  ViewContainer
}
