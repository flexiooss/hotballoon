import {expect, test} from '@playwright/test'
import {onceEvents, POLL, settle, visibilities} from './helpers.js'

// The page holds both targets in the viewport and has nothing to scroll, so only the very first
// visibility check can ever run.

test.beforeEach(async ({page}) => {
  await page.goto('./?feature=visible')
  await page.locator('#fx-fixture').waitFor()
})

test('the fixture page really cannot scroll', async ({page}) => {
  const scrollable = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight)
  expect(scrollable).toBe(false)
})

test('observe reports nothing more while the page stays still', async ({page}) => {
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual([true])
  await settle(page)
  expect(await visibilities(page, 'fx-observe')).toEqual([true])
})

test('observeOnce fires only once', async ({page}) => {
  await expect.poll(() => onceEvents(page), POLL).toEqual(['fx-once'])
  await settle(page)
  expect(await onceEvents(page)).toEqual(['fx-once'])
})