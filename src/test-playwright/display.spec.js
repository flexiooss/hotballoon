import {expect, test} from '@playwright/test'
import {POLL, settle, visibilities} from './helpers.js'

// The target never moves and always sits inside the viewport: `display` is the only thing the
// button changes.

const toggle = page => page.locator('#fx-toggle')

test.beforeEach(async ({page}) => {
  await page.goto('./?feature=display')
  await page.locator('#fx-fixture').waitFor()
})

test('observe follows the target as display is toggled three times', async ({page}) => {
  const expected = [false]
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)

  for (let i = 0; i < 3; i++) {
    await toggle(page).click() // display: block
    expected.push(true)
    await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)

    await toggle(page).click() // display: none
    expected.push(false)
    await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)
  }
})

test('observe reports nothing while the target stays hidden', async ({page}) => {
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual([false])
  await settle(page)
  expect(await visibilities(page, 'fx-observe')).toEqual([false])
})