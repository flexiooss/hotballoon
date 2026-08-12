/**
 * The `observe()` visibility sequence recorded for one target, de-duplicated.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} id
 * @return {Promise<Array<boolean>>}
 */
export const visibilities = async (page, id) => {
  await settle(page)
  return (await page.evaluate(() => window.__events))
      .filter(event => event.id === id)
      .map(event => event.visible)
}

/**
 * The raw ids recorded by `observeOnce()`, kept as-is: a second entry is a bug, never noise.
 *
 * @param {import('@playwright/test').Page} page
 * @return {Promise<Array<string>>}
 */
export const onceEvents = (page) => page.evaluate(() => window.__once)

/**
 * The component defers every callback through `requestIdleCallback` with a 1.5s timeout, so
 * assertions need more room than Playwright's 5s default.
 */
export const POLL = {timeout: 15_000}

/**
 * Waits long enough for a deferred callback to have landed, then lets the caller assert it did
 * not. `expect.poll` cannot prove a negative.
 *
 * @param {import('@playwright/test').Page} page
 * @return {Promise<void>}
 */
export const settle = (page) => page.waitForTimeout(2_500)

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} id
 * @return {Promise<void>}
 */
export const scrollTo = (page, id) => page.evaluate(
  (targetId) => document.getElementById(targetId).scrollIntoView({block: 'center'}),
  id
)

/**
 * @param {import('@playwright/test').Page} page
 * @return {Promise<void>}
 */
export const scrollAway = (page) => page.evaluate(() => window.scrollTo(0, 0))