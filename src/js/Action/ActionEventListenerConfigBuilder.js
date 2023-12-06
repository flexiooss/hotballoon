import {
    EventListenerConfigBuilder
} from "@flexio-oss/js-commons-bundle/event-handler/src/js/EventListenerConfigBuilder.js";

/**
 * @template TYPE
 */
export class ActionEventListenerConfigBuilder extends EventListenerConfigBuilder{
    /**
     * @callback ActionEventListenerConfigBuilder~eventClb
     * @param {?TYPE} payload
     * @param {ActionResponseBuilder} actionResponseBuilder
     * @param {(string|Symbol)} eventName
     * @param {string} executionId
     */
    /**
     * @callback ActionEventListenerConfigBuilder~guardClb
     * @param {?TYPE} payload
     * @return {boolean}
     */

    /**
     * @param {ActionEventListenerConfigBuilder~eventClb} clb
     * @return {this}
     */
    callback(clb) {
        return super.callback(clb)
    }
    /**
     * @param {?ActionEventListenerConfigBuilder~guardClb} clb
     * @return {this}
     */
    guard(clb) {
        return super.guard(clb)
    }
}