export class StoresParameters {
  constructor() {
    const _Stores = new Map()

    Object.defineProperties(this, {
      _Stores: {
        configurable: false,
        enumerable: true,
        writable: false,
        /**
         * @property {Map<Store>}
         * @name StoresParameters#_Stores
         * @protected
         */
        value: _Stores
      }
    })
  }
}
