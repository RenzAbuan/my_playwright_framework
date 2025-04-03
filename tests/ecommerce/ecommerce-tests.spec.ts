// @ts-check
import LoginPage from '../../model/pages/ecommerce/LoginPage'
import { SortCategory } from '../../model/enums/ecommerce/SortCategory'
import { arraysOfObjectsAreEqual } from '../../support/helper/Helper'
import { Customer } from '../../model/data/ecommerce/Customer'
import CartPage from '../../model/pages/ecommerce/CartPage'
import { expect, test } from 'BaseTest'

//TODO COMMENTS, BASETEST, PAGEFACTORY??, STRING CHECK BEFORE FILL

test('Successful Login & Logout', async ({ open }) => {
  
  const homePage = await open(LoginPage)
    .then(_ => _.setUsername('standard_user'))
    .then(_ => _.setPassword('secret_sauce'))
    .then(_ => _.clickLogin())

  // Validate if logged in
  expect(await homePage.getPageTitle()).toBe('Products')
  
  await homePage.openMenu()
    .then(_ => _.clickLogoutMenu())
  const loginPage = await open(LoginPage)

  // Validate if logged out
  expect(await loginPage.isLoginFormVisible()).toBe('Products')
})

test('Invalid credentials should not login and show error message', async ({ open }) => {
  const loginPage = await open(LoginPage)

  await loginPage.setUsername('standard_user')
    .then(_ => _.setPassword('secret_sauce1'))
    .then(_ => _.clickLogin())

  expect(await loginPage.getErrorMessage()).toContain('Username and password do not match any user in this service')
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

test('Items can be added to cart upon viewing/selecting', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/')
  
  const loginPage = new LoginPage(page)

  await loginPage.setUsername('standard_user')
  await loginPage.setPassword('secret_sauce')
  const homePage = await loginPage.clickLogin()
  
  const itemName = 'Sauce Labs Bolt T-Shirt'
  const product = await homePage.getProduct(itemName)
  const itemPage = await homePage.clickItem(itemName)

  expect(await itemPage.getProduct()).toEqual(product)

  await itemPage.clickAddToCart()
  await itemPage.clickShoppingCart()
  const cartPage = await new CartPage(page).init()

  expect(await cartPage.getProductsInCart()).toContainEqual(product)
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
  await homePage.clickShoppingCart()

  const cartPage = await new CartPage(page).init()
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

  await homePage.clickShoppingCart()

  const cartPage = await new CartPage(page).init()
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

  await homePage.clickShoppingCart()
  const cartPage = await new CartPage(page).init()

  const informationPage = await cartPage.clickCheckout()

  await informationPage.setFirstName(user.firstName)
  await informationPage.setLastName(user.lastName)
  await informationPage.setZipCode(user.zipCode)

  const checkoutOverviewPage = await informationPage.clickContinue()

  expect(await checkoutOverviewPage.calculateItemPricetotal()).toBe(await checkoutOverviewPage.getItemPriceTotal())
})

test('Customer Information fields should be mandatory', async ({ page }) => {

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

  await homePage.clickShoppingCart()
  const cartPage = await new CartPage(page).init()

  const informationPage = await cartPage.clickCheckout()

  await informationPage.clickContinue()
  expect(await informationPage.getErrorMessage()).toBe('Error: First Name is required')

  await informationPage.setFirstName(user.firstName)
  await informationPage.clickContinue()

  expect(await informationPage.getErrorMessage()).toBe('Error: Last Name is required')

  await informationPage.setFirstName(user.firstName)
  await informationPage.setLastName(user.lastName)
  await informationPage.clickContinue()

  expect(await informationPage.getErrorMessage()).toBe('Error: Postal Code is required')
})

test('User should be able to cancel checkout but the items should still be selected in the homepage', async ({ page }) => {

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

  const productsAddedToCart = await homePage.getProductsAddedToCart()

  await homePage.clickShoppingCart()
  const cartPage = await new CartPage(page).init()

  const productsInCart = await cartPage.getProductsInCart()
  const informationPage = await cartPage.clickCheckout()

  await informationPage.setFirstName(user.firstName)
  await informationPage.setLastName(user.lastName)
  await informationPage.setZipCode(user.zipCode)

  const checkoutOverviewPage = await informationPage.clickContinue()

  await checkoutOverviewPage.clickCancel()

  expect(await homePage.getPageTitle()).toBe('Products')
  expect(await arraysOfObjectsAreEqual(productsAddedToCart, productsInCart)).toBe(true)
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

  await homePage.clickShoppingCart()
  const cartPage = await new CartPage(page).init()

  const informationPage = await cartPage.clickCheckout()

  await informationPage.setFirstName(user.firstName)
  await informationPage.setLastName(user.lastName)
  await informationPage.setZipCode(user.zipCode)

  const checkoutOverviewPage = await informationPage.clickContinue()

  const checkoutCompletePage = await checkoutOverviewPage.clickFinish()

  expect(await checkoutCompletePage.getMessageHeader()).toBe('Thank you for your order!')
  expect(await checkoutCompletePage.getMessageText()).toBe('Your order has been dispatched, and will arrive just as fast as the pony can get there!')
})

