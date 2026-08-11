import {expect, test} from '@playwright/test'
import {onceEvents, POLL, settle} from './helpers.js'

// Same layout as `details`, but observed with `observeOnce()`.

const summary = page => page.locator('#fx-box > summary')

test.beforeEach(async ({page}) => {
  await page.goto('./?feature=details-once')
  await page.locator('#fx-fixture').waitFor()
})

test('observeOnce stays silent while the box is closed', async ({page}) => {
  await settle(page)
  expect(await onceEvents(page)).toEqual([])
})

test('observeOnce fires when the box is opened', async ({page}) => {
  await summary(page).click()
  await expect.poll(() => onceEvents(page), POLL).toEqual(['fx-once'])
})

test('observeOnce never fires again once the target has been seen', async ({page}) => {
  await summary(page).click()
  await expect.poll(() => onceEvents(page), POLL).toEqual(['fx-once'])

  for (let i = 0; i < 3; i++) {
    await summary(page).click() // close
    await summary(page).click() // open
  }
  await settle(page)
  expect(await onceEvents(page)).toEqual(['fx-once'])
})