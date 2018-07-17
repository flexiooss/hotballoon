export class ViewStoresParameters {
  constructor() {
    const _Stores = new Map()

    Object.defineProperties(this, {
      _Stores: {
        configurable: false,
        enumerable: true,
        writable: false,
        /**
         * @property {Map<StoreInterface>}
         * @name ViewStoresParameters#_Stores
         * @protected
         */
        value: _Stores
      }
    })
  }
}
