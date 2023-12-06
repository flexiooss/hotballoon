import {OrderedEventListenerConfigBuilder} from "@flexio-oss/js-commons-bundle/event-handler/index.js";

/**
 * @template TYPE
 */
export class StoreEventListenerConfigBuilder extends OrderedEventListenerConfigBuilder{

    /**
     * @param {function(payload:?TYPE, eventName:(string|Symbol), executionId:string)} clb
     * @return {this}
     */
    callback(clb) {
        return super.callback(clb)
    }

    /**
     * @param {{function(payload:?TYPE)}} clb
     * @return {this}
     */
    guard(clb) {
        return super.guard(clb)
    }
}