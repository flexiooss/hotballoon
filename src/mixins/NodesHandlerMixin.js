'use strict'
import { html } from '../HotballoonElement/CreateHotBalloonElement'
/**
 *
 * @class
 * @description Mixin - handle a NodeElement property
 */
export const NodesHandlerMixin = (Base) => class extends Base {
  /**
   * @description Mixin - init
   * @param {View} View
   * @memberOf NodesHandlerMixin
   * @instance
   */
  NodesHandlerMixinInit(View) {
    this._html = (querySelector, ...args) => {
      return html(this, querySelector, ...args)
    }
  }
}
