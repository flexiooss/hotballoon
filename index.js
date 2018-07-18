import {Dispatcher} from './src/Dispatcher'
import {
  Store,
  INIT as STORE_INIT
} from './src/Store/Store'
import {CHANGED} from './src/Store/StoreInterface'
import {ProxyStore} from './src/Store/ProxyStore'
import {EventHandler} from './src/EventHandler'
import {EventOrderedHandler} from './src/EventOrderedHandler'
import {Action} from './src/Action'
import {
  ViewParameters,
  View,
  ATTRIBUTE_NODEREF
} from './src/View/View'
import {MapOfState} from './src/MapOfState'
import {ViewContainer, ViewContainerParameters} from './src/View/ViewContainer'
import {HotBalloonApplication} from './src/HotBalloonApplication'
import {PrivateStateMixin} from './src/mixins/PrivateStateMixin'
import {Component} from './src/Component'

import {html} from './src/HotballoonElement/CreateHotBalloonElement'
import {HotballoonElementParams} from './src/HotballoonElement/HotballoonElementParams'
import {
  HotBalloonAttributeHandler,
  select as $
} from './src/HotballoonElement/HotBalloonAttributeHandler'

import {State} from './src/Store/State'
import {Storage} from './src/Store/Storage'
import {StoreModel} from './src/Store/StoreModel'
import {ViewStoresParameters} from './src/View/ViewStoresParameters'
import {DataStoreInterface} from './src/Store/DataStoreInterface'
import {DataStoreHandlerInterface} from './src/Store/DataStoreHandlerInterface'

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

export {
  HotBalloonApplication,
  Dispatcher,
  Component,
  ViewStoresParameters,
  Store,
  ProxyStore,
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
  $,
  DataStoreInterface,
  DataStoreHandlerInterface
}
