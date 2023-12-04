import {
    EventListenerConfigBuilder
} from "@flexio-oss/js-commons-bundle/event-handler/src/js/EventListenerConfigBuilder.js";

export class ActionEventListenerConfigBuilder extends EventListenerConfigBuilder{
    /**
     * @callback ActionEventListenerConfigBuilder~eventClb
     * @param {?Object} payload
     * @param {ActionResponseBuilder} actionResponseBuilder
     * @param {(string|Symbol)} eventName
     * @param {string} executionId
     */

    /**
     * @param {ActionEventListenerConfigBuilder~eventClb} clb
     * @return {this}
     */
    callback(clb) {
        return super.callback(clb)
    }
}