/* global runTest */
import '../../generated/io/package'
import {TestCase} from '@flexio-oss/code-altimeter-js'
import {HyperFlex} from '../js/HyperFlex'
import {HyperFlexParams} from '../js/HyperFlexParams'
import {AttributeHandler} from '../js/AttributeHandler'
import '@flexio-oss/js-commons-bundle/flex-types'
const assert = require('assert')

export class TestHyperFlex extends TestCase {
  testInstance() {
    new HyperFlex('div#monId.maClass', new HyperFlexParams())
    new AttributeHandler({'nodeType': 3})
  }
}

runTest(TestHyperFlex)
