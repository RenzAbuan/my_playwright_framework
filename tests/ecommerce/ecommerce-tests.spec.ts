// @ts-check
import { test, expect } from '@playwright/test'
import LoginPage from '../../models/pages/ecommerce/LoginPage'
import HomePage from '../../models/pages/ecommerce/HomePage'
import CartPage from '../../models/pages/ecommerce/CartPage'
import { SortCategory } from '../../models/enums/ecommerce/SortCategory'
import { arrayBuffer } from 'stream/consumers'
import { arraysOfObjectsAreEqual } from '../../support/helper/Helper'
import { Customer } from '../../models/data/ecommerce/Customer'

test('Successful Login', async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/')

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  const homePage = await loginPage.clickLogin()

  expect(await homePage.getPageTitle()).toBe('Products')
})

test('Items are successfully sorted', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  const homePage = await loginPage.clickLogin()

  await homePage.selectSortCategory(SortCategory.Name_Ascending)
  expect(await homePage.isSortedFromZtoA(await homePage.getItemNames())).toBe(true)

  await homePage.selectSortCategory(SortCategory.Name_Descending)
  expect(await homePage.isSortedFromAtoZ(await homePage.getItemNames())).toBe(true)

  await homePage.selectSortCategory(SortCategory.Price_Ascending)
  expect(await homePage.isSortedFromLowToHigh(await homePage.getItemPrices())).toBe(true)

  await homePage.selectSortCategory(SortCategory.Price_Descending)
  expect(await homePage.isSortedFromHighToLow(await homePage.getItemPrices())).toBe(true)
})

test('Items added are successfully removed from Cart', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light']

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  const homePage = await loginPage.clickLogin()

  for(const item of items)
    await homePage.clickAddToCart(item)
  const cartPage = await homePage.clickShoppingCart()

  await cartPage.removeItem(items[0])

  expect(await cartPage.isItemInCart(items[0])).toBe(false)
  expect(await cartPage.isItemInCart(items[1])).toBe(true)
})

test('Item/s has been added to Cart with correct names, descriptions & prices', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light']

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  const homePage = await loginPage.clickLogin()

  for(const item of items)
    await homePage.clickAddToCart(item)

  const productsAddedToCart = await homePage.getProductsAddedToCart()

  const cartPage = await homePage.clickShoppingCart()

  const productsInCart = await cartPage.getProductsInCart()
  
  expect(await arraysOfObjectsAreEqual(productsAddedToCart, productsInCart)).toBe(true)
})

test('Item price total in checkout page is correct', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Onesie']
  const user: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '1234'
  }

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')

  const homePage = await loginPage.clickLogin()

  for(const item of items)
    await homePage.clickAddToCart(item)

  const cartPage = await homePage.clickShoppingCart()
  const informationPage = await cartPage.clickCheckout()

  await informationPage.setFirstName(user.firstName)
  await informationPage.setLastName(user.lastName)
  await informationPage.setZipCode(user.zipCode)

  const checkoutOverviewPage = await informationPage.clickContinue()

  expect(await checkoutOverviewPage.calculateItemPricetotal()).toBe(await checkoutOverviewPage.getItemPriceTotal())
})

test('Item/s checkout is successful', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Onesie']
  const user: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '1234'
  }

  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')

  const homePage = await loginPage.clickLogin()

  for(const item of items)
    await homePage.clickAddToCart(item)

  const cartPage = await homePage.clickShoppingCart()
  const informationPage = await cartPage.clickCheckout()

  await informationPage.setFirstName(user.firstName)
  await informationPage.setLastName(user.lastName)
  await informationPage.setZipCode(user.zipCode)

  const checkoutOverviewPage = await informationPage.clickContinue()

  const checkoutCompletePage = await checkoutOverviewPage.clickFinish()

  expect(await checkoutCompletePage.getMessageHeader()).toBe('Thank you for your order!')
  expect(await checkoutCompletePage.getMessageText()).toBe('Your order has been dispatched, and will arrive just as fast as the pony can get there!')
})

