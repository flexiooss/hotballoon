import {OnDemandAsyncProxyStore} from "./OnDemandAsyncProxyStore";
import {AsyncProxyStoreBuilder} from "./AsyncProxyStoreBuilder";

/**
 *
 * @template  STORE_TYPE, STORE_TYPE_BUILDER,  TYPE, TYPE_BUILDER
 */
export class OnDemandAsyncProxyStoreBuilder extends AsyncProxyStoreBuilder {
  /**
   * @return {Promise<AsyncProxyStore<STORE_TYPE, STORE_TYPE_BUILDER, TYPE, TYPE_BUILDER>>}
   */
  async build() {
    return new OnDemandAsyncProxyStore(await this._buildProxyStoreConfig(), this._asyncInitialValue);
  }
}
