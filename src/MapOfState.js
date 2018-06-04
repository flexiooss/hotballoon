import { MapOfInstance } from 'flexio-jshelpers'
import { State } from './storeBases/State'

export class MapOfState extends MapOfInstance {
  constructor() {
    super()
    this._classType = State
  }
}
