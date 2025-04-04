// @ts-check
import { SortCategory } from '../../model/enums/ecommerce/SortCategory'
import { arraysOfObjectsAreEqual } from '../../support/helper/Helper'
import { Customer } from '../../model/data/ecommerce/Customer'
import { test, expect } from 'tests/BaseTest'
import { LoginPage, CartPage } from '@pages'

test('Successful Login & Logout', async ({ open }) => {
  
  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  // Validate if logged in
  expect(await homePage.getPageTitle()).toBe('Products')
  
  const loginPage = await homePage.openMenu()
    .then(_ => _.clickLogoutMenu())

  // Validate if logged out
  expect(await loginPage.isLoginFormVisible()).toBe(true)
})

test('Invalid credentials should not login and show error message', async ({ open }) => {
  const loginPage = await open(LoginPage)

  await loginPage.loginUser(process.env.STANDARD_USERNAME as string, "invalidpassword")

  // Verify that user is not able to login
  expect(await loginPage.getErrorMessage()).toContain('Username and password do not match any user in this service')
})

test('Items are successfully sorted', async ({ open }) => {

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  await homePage.selectSortCategory(SortCategory.Name_Ascending)
  expect(await homePage.isSortedFromZtoA(await homePage.getItemNames())).toBe(true)

  await homePage.selectSortCategory(SortCategory.Name_Descending)
  expect(await homePage.isSortedFromAtoZ(await homePage.getItemNames())).toBe(true)

  await homePage.selectSortCategory(SortCategory.Price_Ascending)
  expect(await homePage.isSortedFromLowToHigh(await homePage.getItemPrices())).toBe(true)

  await homePage.selectSortCategory(SortCategory.Price_Descending)
  expect(await homePage.isSortedFromHighToLow(await homePage.getItemPrices())).toBe(true)
})

test('Items can be added to cart upon viewing/selecting', async ({ open }) => {

  const itemName = 'Sauce Labs Bolt T-Shirt'

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())
  
  const product = await homePage.getProduct(itemName)
  const itemPage = await homePage.clickItem(itemName)

  // Verify if product details from the list in homepage matches with the product view
  expect(await itemPage.getProduct()).toEqual(product)

  const cartPage =  await itemPage.clickAddToCart()
    .then(_ => _.clickShoppingCart())

  // Verify if products were added to cart
  expect(await cartPage.getProductsInCart()).toContainEqual(product)
})

test('Items added are successfully removed from Cart', async ({ open }) => {

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light']

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  for(const item of items)
    await homePage.clickAddToCart(item)

  const cartPage = await homePage.clickShoppingCart()
    .then(_ => _.removeItem(items[0]))

  // Verify if item is removed from cart
  expect(await cartPage.isItemInCart(items[0])).toBe(false)
  // Verify if unremoved item remains in the cart
  expect(await cartPage.isItemInCart(items[1])).toBe(true)
})

test('Item/s has been added to Cart with correct names, descriptions & prices', async ({ open }) => {

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light']

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  for(const item of items)
    await homePage.clickAddToCart(item)

  const productsAddedToCart = await homePage.getProductsAddedToCart()

  const productsInCart = await homePage.clickShoppingCart()
    .then(_ => _.getProductsInCart())
  
  // Verify product details of the products added to cart are correct
  expect(await arraysOfObjectsAreEqual(productsAddedToCart, productsInCart)).toBe(true)
})

test('Item price total in checkout page is correct', async ({ open }) => {

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Onesie']
  const user: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '1234'
  }

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  for(const item of items)
    await homePage.clickAddToCart(item)

  const checkoutOverviewPage = await homePage.clickShoppingCart()
    .then(_ => _.clickCheckout())
    .then(_ => _.setCustomerDetails(user))
    .then(_ => _.clickContinue())

  // Verify pricing
  expect(await checkoutOverviewPage.calculateItemPricetotal()).toBe(await checkoutOverviewPage.getItemPriceTotal())
})

test('Customer Information fields should be mandatory', async ({ open }) => {

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Onesie']
  const user: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '1234'
  }

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  for(const item of items)
    await homePage.clickAddToCart(item)

  await homePage.clickShoppingCart()

  const informationPage = await homePage.clickShoppingCart()
    .then(_ => _.clickCheckout())

  await informationPage.clickContinue()
  expect(await informationPage.getErrorMessage()).toBe('Error: First Name is required')

  await informationPage.setFirstName(user.firstName)
    .then(_ => _.clickContinue())

  expect(await informationPage.getErrorMessage()).toBe('Error: Last Name is required')

  await informationPage.setFirstName(user.firstName)
    .then(_ => _.setLastName(user.lastName))
    .then(_ => _.clickContinue())

  expect(await informationPage.getErrorMessage()).toBe('Error: Postal Code is required')
})

test('User should be able to cancel checkout but the items should still be selected in the homepage', async ({ open }) => {

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Onesie']
  const user: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '1234'
  }

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  for(const item of items)
    await homePage.clickAddToCart(item)

  const productsAddedToCart = await homePage.getProductsAddedToCart()
  
  const cartPage = await homePage.clickShoppingCart()
  const productsInCart = await cartPage.getProductsInCart()

  const pageTitle = await cartPage.clickCheckout()
    .then(_ => _.setCustomerDetails(user))
    .then(_ => _.clickContinue())
    .then(_ => _.clickCancel())
    .then(_ => _.getPageTitle())

  // Verify cheeckout is cancelled and navigated back to homepage
  expect(pageTitle).toBe('Products')
  // Verify if products in the cart are still selected
  expect(await arraysOfObjectsAreEqual(productsAddedToCart, productsInCart)).toBe(true)
})

test('Item/s checkout is successful', async ({ open }) => {

  const items: string[] = ['Sauce Labs Bolt T-Shirt', 'Sauce Labs Bike Light', 'Sauce Labs Onesie']
  const user: Customer = {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '1234'
  }

  const homePage = await open(LoginPage)
    .then(_ => _.loginUser())

  for(const item of items)
    await homePage.clickAddToCart(item)

  const checkoutCompletePage = await homePage.clickShoppingCart()
  .then(_ => _.clickCheckout())
  .then(_ => _.setCustomerDetails(user))
  .then(_ => _.clickContinue())
  .then(_ => _.clickFinish())

  // Verify successful checkout messages
  expect(await checkoutCompletePage.getMessageHeader()).toBe('Thank you for your order!')
  expect(await checkoutCompletePage.getMessageText()).toBe('Your order has been dispatched, and will arrive just as fast as the pony can get there!')
})

