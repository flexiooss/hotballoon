import {expect, test} from '@playwright/test'
import {POLL, settle, visibilities} from './helpers.js'

// The target lives inside a closed `<details>`: it is inside the viewport but not rendered, and
// the box is the only thing that moves.

const summary = page => page.locator('#fx-box > summary')

test.beforeEach(async ({page}) => {
  await page.goto('./?feature=details')
  await page.locator('#fx-fixture').waitFor()
})

test('observe follows the target as the box is opened and closed three times', async ({page}) => {
  const expected = [false]
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)

  for (let i = 0; i < 3; i++) {
    await summary(page).click() // open
    expected.push(true)
    await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)

    await summary(page).click() // close
    expected.push(false)
    await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual(expected)
  }
})

test('observe reports nothing while the box stays closed', async ({page}) => {
  await expect.poll(() => visibilities(page, 'fx-observe'), POLL).toEqual([false])
  await settle(page)
  expect(await visibilities(page, 'fx-observe')).toEqual([false])
})