import {OrderedEventListenerConfigBuilder} from "@flexio-oss/js-commons-bundle/event-handler";

/**
 * @template TYPE
 */
export class StoreEventListenerConfigBuilder extends OrderedEventListenerConfigBuilder{
    /**
     * @callback StoreEventListenerConfigBuilder~eventClb
     * @param {?TYPE} payload
     * @param {(string|Symbol)} eventName
     * @param {string} executionId
     */
    /**
     * @callback StoreEventListenerConfigBuilder~guardClb
     * @param {?TYPE} payload
     * @return {boolean}
     */

    /**
     * @param {StoreEventListenerConfigBuilder~eventClb} clb
     * @return {this}
     */
    callback(clb) {
        return super.callback(clb)
    }
    /**
     * @param {?StoreEventListenerConfigBuilder~guardClb} clb
     * @return {this}
     */
    guard(clb) {
        return super.guard(clb)
    }
}