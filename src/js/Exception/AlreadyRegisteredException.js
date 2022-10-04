import {HBException} from "./HBException";

export class AlreadyRegisteredException extends HBException {
  /**
   * @return {string}
   */
  realName() {
    return 'AlreadyRegisteredException';
  }

  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static COMPONENT(id) {
    return new AlreadyRegisteredException(`Component already registered : ${id}`)
  }

  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static STORE(id) {
    return new AlreadyRegisteredException(`Store already registered : ${id}`)
  }

  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static ACTION(id) {
    return new AlreadyRegisteredException(`Action already registered : ${id}`)
  }

  /**
   * @param {string} id
   * @return {AlreadyRegisteredException}
   */
  static VIEW_CONTAINER(id) {
    return new AlreadyRegisteredException(`ViewContainer already registered : ${id}`)
  }

}
