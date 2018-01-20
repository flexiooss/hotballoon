import {
  View
} from './View'
import {
  InstancesMap
} from './InstancesMap'
import {
  HotBalloonApplicationContext
} from './HotBalloonApplicationContext'

class ViewContainer extends HotBalloonApplicationContext {
  constructor(hotBallonApplication) {
    super(hotBallonApplication)
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
    this._viewContainers.foreach((key, container) => {
      container.render(parentNode)
    })
  }

  _renderViews(parentNode) {
    this._views.foreach((key, view) => {
      view.render(parentNode)
    })
  }

  render(parentNode) {
    if (!this._mounted) {
      this.mount()
    }
    this._renderContainer(parentNode)
    this._renderViews(parentNode)
    this._rendered = true
  }
  createAction(actionName, typAction, payload) {
    const action = this.APP().getAction(actionName)
    if (action) {
      action.newAction(typAction, payload)
    }
  }
  newViewAction(actionName, clb, ...args) {
    this.createAction(actionName, clb, ...args)
  }
}

export {
  ViewContainer
}
