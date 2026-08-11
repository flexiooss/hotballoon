import {IntersectionObserverComponent} from '../js/Application/intersectionObserver/IntersectionObserverComponent.js'

const GROUP = 'e2e'

/**
 * Mirrors IntersectionObserverHandler's wiring: `requestIdleCallback` when the browser exposes
 * it, `setTimeout` otherwise. The 1.5s timeout matters here — a Playwright page under load may
 * never report an idle period, and without it the callbacks would simply never run.
 *
 * @param {function} clb
 */
const requestIdleCallback = (clb) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(clb, {timeout: 1_500})
  } else {
    setTimeout(clb)
  }
}

/**
 * Bridges to the specs.
 * `__events`: every `observe()` callback, as {id, visible} — `visible` is the second argument of
 *             IntersectionObserverComponent~genericCallback (named `documentVisibilityState`).
 * `__once`:   the id of every `observeOnce()` callback (that callback takes no visibility flag).
 */
const resetBridges = () => {
  window.__events = []
  window.__once = []
}

/**
 * @param {HTMLElement} element
 * @param {boolean} visible
 */
const recordObserve = (element, visible) => {
  window.__events.push({id: element.id, visible: visible})
}

/**
 * @param {HTMLElement} element
 */
const recordOnce = (element) => {
  window.__once.push(element.id)
}

// --- DOM helpers -------------------------------------------------------------

/**
 * Resets the UA margins so the "page does not scroll" features really don't scroll,
 * and returns the fixture root the specs scope their locators on.
 *
 * @return {HTMLElement}
 */
const fixtureRoot = () => {
  document.documentElement.style.margin = '0'
  document.body.style.margin = '0'
  const root = document.createElement('div')
  root.id = 'fx-fixture'
  document.body.append(root)
  return root
}

/**
 * @param {string} id
 * @return {HTMLElement}
 */
const target = (id) => {
  const element = document.createElement('div')
  element.id = id
  element.textContent = id
  element.style.height = '50px'
  element.style.background = '#cde'
  return element
}

/**
 * Tall enough to push the target well past the observer's 100px rootMargin, so
 * "off screen" is unambiguous.
 *
 * @return {HTMLElement}
 */
const spacer = () => {
  const element = document.createElement('div')
  element.style.height = '250vh'
  return element
}

/**
 * @param {string} id
 * @param {HTMLElement} content
 * @return {HTMLDetailsElement}
 */
const collapsedBox = (id, content) => {
  const details = document.createElement('details')
  details.id = id
  const summary = document.createElement('summary')
  summary.textContent = 'box'
  details.append(summary, content)
  return details
}

/**
 * A button that flips the target between `display: none` and `display: block`.
 *
 * @param {string} id
 * @param {HTMLElement} element
 * @return {HTMLButtonElement}
 */
const displayToggle = (id, element) => {
  const button = document.createElement('button')
  button.id = id
  button.textContent = 'toggle'
  button.addEventListener('click', () => {
    element.style.display = element.style.display === 'none' ? 'block' : 'none'
  })
  return button
}

/**
 * @return {IntersectionObserverComponent}
 */
const observer = () => {
  resetBridges()
  return new IntersectionObserverComponent(requestIdleCallback)
}

// --- Features ----------------------------------------------------------------

const features = {
  /**
   * Nothing can move: no spacer, so the page is not scrollable and both targets stay
   * in the viewport for the whole test. Only the initial visibility check is exercised.
   */
  'visible': () => {
    const root = fixtureRoot()
    const observed = target('fx-observe')
    const once = target('fx-once')
    root.append(observed, once)

    const component = observer()
    component.observe(GROUP, observed, recordObserve)
    component.observeOnce(GROUP, once, recordOnce)
  },

  /**
   * `observe()` on a target parked between two 250vh spacers: off screen at load,
   * revealed and hidden again by scrolling.
   */
  'scroll': () => {
    const root = fixtureRoot()
    const observed = target('fx-observe')
    root.append(spacer(), observed, spacer())

    observer().observe(GROUP, observed, recordObserve)
  },

  /**
   * Same layout, `observeOnce()`: the callback must fire the first time the target is
   * scrolled into view and never again.
   */
  'scroll-once': () => {
    const root = fixtureRoot()
    const once = target('fx-once')
    root.append(spacer(), once, spacer())

    observer().observeOnce(GROUP, once, recordOnce)
  },

  /**
   * `observe()` on a target inside a closed `<details>`: hidden at load, revealed by
   * opening the box.
   */
  'details': () => {
    const root = fixtureRoot()
    const observed = target('fx-observe')
    root.append(collapsedBox('fx-box', observed))

    observer().observe(GROUP, observed, recordObserve)
  },

  /**
   * Same layout, `observeOnce()`.
   */
  'details-once': () => {
    const root = fixtureRoot()
    const once = target('fx-once')
    root.append(collapsedBox('fx-box', once))

    observer().observeOnce(GROUP, once, recordOnce)
  },

  /**
   * `observe()` on a target hidden with `display: none`, revealed by a button. The target
   * always sits inside the viewport, so display is the only thing that changes.
   */
  'display': () => {
    const root = fixtureRoot()
    const observed = target('fx-observe')
    observed.style.display = 'none'
    root.append(displayToggle('fx-toggle', observed), observed)

    observer().observe(GROUP, observed, recordObserve)
  },
}

/**
 * @param {?string} selectedFeature
 * @param {Object} featuresMap
 */
const printFeatureError = (selectedFeature, featuresMap) => {
  const msg = document.createElement('div')
  msg.id = 'fx-error'
  msg.textContent = (selectedFeature === null
      ? 'Missing required query parameter: ?feature=<name>'
      : `Unknown feature: "${selectedFeature}"`)
    + `. Known features: ${Object.keys(featuresMap).join(', ')}`
  document.body.append(msg)
}

const feature = new URLSearchParams(window.location.search).get('feature')
const mount = features[feature]

if (mount) {
  mount()
} else {
  printFeatureError(feature, features)
}