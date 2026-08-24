/**
 * @param {?string} selectedFeature
 * @param {Object} featuresMap
 */
export function printFeatureError(selectedFeature, featuresMap) {
  const msg = document.createElement('div')
  msg.id = 'fx-error'
  msg.textContent = (selectedFeature === null
      ? 'Missing required query parameter: ?feature=<name>'
      : `Unknown feature: "${selectedFeature}"`)
    + `. Known features: ${Object.keys(featuresMap).join(', ')}`
  document.body.append(msg)
}

