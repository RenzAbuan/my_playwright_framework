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

3. run `npm ci` to install the dependencies

4. run `npx playwright test` for test execution

**DON'T ADD .env TO A GIT REPO.**

**Since the target site is a public website with publicly exposed credentials, this is what my .env file looks like**

```
PLAYWRIGHT_BROWSER=chromium
PLAYWRIGHT_HEADLESS=false
TEST_ENVIRONMENT=qa
STANDARD_USERNAME=standard_user
USER_PASSWORD=secret_sauce
```
