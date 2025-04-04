## Setup

After cloning the project:

Create a .env file at the root of the project with the following entries:

PLAYWRIGHT_BROWSER=***
PLAYWRIGHT_HEADLESS=***
TEST_ENVIRONMENT=***
STANDARD_USERNAME=***
USER_PASSWORD=***

- **STANDARD_USERNAME** : Default username
- **USER_PASSWORD** : Default password for username
- **TEST_ENVIRONMENT**-> Optional. 'qa'|'staging'|'prod' Defaults to qa
- **PLAYWRIGHT_HEADLESS** -> Optional. Defaults to true
- **PLAYWRIGHT_BROWSER** -> Optional. 'chromium'|'firefox'|'webkit' defaults to chromium

1. Make sure you have node.js installed. Please refer to https://nodejs.org/en/download
   
2. install playwright browsers with `npx playwright install`

3. run `npm ci` to install the dependencies

4. run `npx playwright test` for test execution
