import {Dispatcher} from './src/Dispatcher'
import {
  Store,
  INIT as STORE_INIT,
  CHANGED
} from './src/storeBases/Store'
import {EventHandler} from './src/EventHandler'
import {EventOrderedHandler} from './src/EventOrderedHandler'
import {Action} from './src/Action'
import {
  ViewParameters,
  View,
  ATTRIBUTE_NODEREF,
  INIT as VIEW_INIT,
  UPDATE,
  UPDATED,
  RENDER,
  RENDERED, MOUNT,
  MOUNTED, STATE_CHANGE,
  STATE_CHANGED,
  STORE_CHANGED
} from './src/View'
import {MapOfState} from './src/MapOfState'
import {ViewContainer, ViewContainerParameters} from './src/ViewContainer'
import {HotBalloonApplication} from './src/HotBalloonApplication'
import {PrivateStateMixin} from './src/mixins/PrivateStateMixin'
import {Component} from './src/Component'

import {html} from './src/HotballoonElement/CreateHotBalloonElement'
import {HotballoonElementParams} from './src/HotballoonElement/HotballoonElementParams'
import {
  HotBalloonAttributeHandler,
  select as $
} from './src/HotballoonElement/HotBalloonAttributeHandler'

import {State} from './src/storeBases/State'
import {Storage} from './src/storeBases/Storage'
import {StoreModel} from './src/storeBases/StoreModel'

export const hotballoonElement = {
  html,
  HotBalloonAttributeHandler
}

export const storeBases = {
  State,
  Storage,
  StoreModel
}

export const STORE_EVENTS = {
  STORE_INIT,
  CHANGED
}

export const VIEW_EVENTS = {
  VIEW_INIT,
  UPDATE,
  UPDATED,
  RENDER,
  RENDERED,
  MOUNT,
  MOUNTED,
  STATE_CHANGE,
  STATE_CHANGED,
  STORE_CHANGED
}

export {
  HotBalloonApplication,
  Dispatcher,
  Component,
  Store,
  Action,
  ViewContainer,
  ViewContainerParameters,
  View,
  ViewParameters,
  ATTRIBUTE_NODEREF,
  MapOfState,
  PrivateStateMixin,
  EventHandler,
  EventOrderedHandler,
  html,
  HotballoonElementParams as HtmlParams,
  $
}
