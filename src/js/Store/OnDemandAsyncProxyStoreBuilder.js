import {OnDemandAsyncProxyStore} from "./OnDemandAsyncProxyStore";
import {AsyncProxyStoreBuilder} from "./AsyncProxyStoreBuilder";

/**
 *
 * @template  STORE_TYPE, STORE_TYPE_BUILDER,  TYPE, TYPE_BUILDER
 */
export class OnDemandAsyncProxyStoreBuilder extends AsyncProxyStoreBuilder {
  /**
   * @param {function(state: STORE_TYPE, proxyStore:?StoreInterface<TYPE>, onDemand:boolean ):Promise<TYPE>} mapper
   * @return {this}
   */
  mapper(mapper) {
    return super.mapper(mapper);
  }
  /**
   * @return {Promise<AsyncProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>>}
   */
  async build() {
    return new OnDemandAsyncProxyStore(await this._buildProxyStoreConfig(), this._asyncInitialValue);
  }
}
