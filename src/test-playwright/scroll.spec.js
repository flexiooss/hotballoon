import {expect, test} from '@playwright/test'
import {POLL, scrollAway, scrollTo, settle, visibilities} from './helpers.js'

// The target sits between two 250vh spacers: off screen at load, and far enough away that the
// observer's 100px rootMargin cannot blur the boundary.

test.beforeEach(async ({page}) => {
  await page.goto('./?feature=scroll')
  await page.locator('#fx-fixture').waitFor()
})

test('observe reports nothing while the page is not scrolled', async ({page}) => {
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual([false])
  await settle(page)
  expect(await visibilities(page, 'fx-observe')).toEqual([false])
})

test('observe follows the target in and out of the viewport over three scrolls', async ({page}) => {
  const expected = [false]
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)

  for (let i = 0; i < 3; i++) {
    await scrollTo(page, 'fx-observe')
    expected.push(true)
    await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)

    await scrollAway(page)
    expected.push(false)
    await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)
  }
})