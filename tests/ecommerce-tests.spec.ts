// @ts-check
import { test, expect } from '@playwright/test'
import LoginPage from '../models/pages/LoginPage'
import HomePage from '../models/pages/HomePage'
import CartPage from '../models/pages/CartPage'
import { SortCategory } from '../models/enums/SortCategory'

test('Successful Login', async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/')

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  await loginPage.clickLogin()

  const homePage = new HomePage(page)
  expect(await homePage.getPageTitle()).toBe('Products')
})

test('Item/s has been added to Cart', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light']

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  await loginPage.clickLogin()

  const homePage = new HomePage(page)
  for(const item of items)
    await homePage.clickAddToCart(item)
  await homePage.clickShoppingCart()

  const cartPage = new CartPage(page)
  
  for(const item of items)
    expect(await cartPage.isItemAddedToCart(item)).toBeTruthy()
})


test('Items are successfully sorted', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  await loginPage.clickLogin()

  const homePage = new HomePage(page)

  await homePage.selectSortCategory(SortCategory.Name_Ascending)
  expect(await homePage.isSortedFromZtoA(await homePage.getItems())).toBeTruthy()

  await homePage.selectSortCategory(SortCategory.Name_Descending)
  expect(await homePage.isSortedFromAtoZ(await homePage.getItems())).toBeTruthy()

  await homePage.selectSortCategory(SortCategory.Price_Ascending)
  expect(await homePage.isSortedFromLowToHigh(await homePage.getItemPrices())).toBeTruthy()

  await homePage.selectSortCategory(SortCategory.Price_Descending)
  expect(await homePage.isSortedFromHighToLow(await homePage.getItemPrices())).toBeTruthy()
})

