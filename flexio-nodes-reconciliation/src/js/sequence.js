import {Sequence} from '@flexio-oss/js-commons-bundle/js-helpers'

const sequence = new Sequence()
/**
 *
 * @return {string}
 */
export const getNextSequence = () => sequence.nextID()
