import {expect, test} from '@playwright/test'
import {onceEvents, POLL, scrollAway, scrollTo, settle} from './helpers.js'

// Same layout as `scroll`, but observed with `observeOnce()`.

test.beforeEach(async ({page}) => {
  await page.goto('./?feature=scroll-once')
  await page.locator('#fx-fixture').waitFor()
})

test('observeOnce stays silent while the target is off screen', async ({page}) => {
  await settle(page)
  expect(await onceEvents(page)).toEqual([])
})

test('observeOnce fires when the target is scrolled into view', async ({page}) => {
  await scrollTo(page, 'fx-once')
  await expect.poll(() => onceEvents(page), POLL).toEqual(['fx-once'])
})

test('observeOnce never fires again once the target has been seen', async ({page}) => {
  await scrollTo(page, 'fx-once')
  await expect.poll(() => onceEvents(page), POLL).toEqual(['fx-once'])

  for (let i = 0; i < 3; i++) {
    await scrollAway(page)
    await scrollTo(page, 'fx-once')
  }
  await settle(page)
  expect(await onceEvents(page)).toEqual(['fx-once'])
})