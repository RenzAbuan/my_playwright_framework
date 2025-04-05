## Simple Playwright Framework using Typescript -> Page-Object model 
## Target site: https://www.saucedemo.com/

## Setup

After cloning the project ('master' branch):

Create a .env file at the root of the project with the ff contents:

```
PLAYWRIGHT_BROWSER=***
PLAYWRIGHT_HEADLESS=***
TEST_ENVIRONMENT=***
STANDARD_USERNAME=***
USER_PASSWORD=***
```
- **PLAYWRIGHT_HEADLESS**: Optional. Defaults to true
- **PLAYWRIGHT_BROWSER**: Optional. 'chromium'|'firefox'|'webkit' defaults to chromium
- **TEST_ENVIRONMENT**: Optional. 'qa'|'staging'|'prod' Defaults to qa
- **STANDARD_USERNAME** : Default username
- **USER_PASSWORD** : Default password for username

1. Make sure you have node.js installed. Please refer to https://nodejs.org/en/download

2. In terminal, install playwright packages `npm install @playwright/test@latest`
   
3. In termina, install playwright browsers using `npx playwright install`

4. In termina, run `npm ci` to install the dependencies

5. In terminal, run `npx playwright test` for test execution

**DON'T ADD .env TO A GIT REPO.**

**Since the target site is a public website with publicly exposed credentials, this is what my .env file looks like**

```
PLAYWRIGHT_BROWSER=chromium
PLAYWRIGHT_HEADLESS=false
TEST_ENVIRONMENT=qa
STANDARD_USERNAME=standard_user
USER_PASSWORD=secret_sauce
```

## Test Scripting & Execution Overview

The scripts could be created in multiple ways the tester is comfortable with

1. First approach (methods below are only an example and may not be implemented on actual tests):

```
  const checkoutSuccessful = await open(LoginPage)
    .then(_ => _.loginUser())
    .then(_ => _.addToCart('test product'))
    .then(_ => _.checkout())
    .then(_ => _.isCheckoutSuccessMessageDisplayed())

  expect(checkoutSuccessful).toBe('true')
```

2. Second Approach (methods below are only an example and may not be implemented on actual tests):

```
  const loginPage = await open(LoginPage)
  const landingPage = await loginPage.loginUser()
  const cartPage = await landingPage.addToCart('test product')
  await cartPage.checkout()
  const checkoutSuccessful = await cartPage.isCheckoutSuccessMessageDisplayed()

  expect(checkoutSuccessful).toBe('true')
```

The core part of the script is the open() function where it takes a parameter of a class that extends BasePage e.g. LoginPage, instatiates 
and returns the object instance of the class parameter. Basically used as a starting point.

This is also the function that opens the browser url stated on environment variable

// This opens the browser and navigates to the BaseURL and creates an instance of LoginPage and then assigns it to loginPage variable
const loginPage = await open(LoginPage)

Note: Only the first usage of open executes the page.goTo(baseUrl). The corresponding usage of open just instantiates the Page Object.

sample use case:
const loginPage = await open(LoginPage) // instantiates LoginPage and opens the base url on the browser
await loginPage.login()
const homePage = await open(HomePage) // only instantiates HomePage
await const condition = homePage.isUserLoggedIn()