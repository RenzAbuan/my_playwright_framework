import BasePage from "./BasePage";
import CheckoutOverviewPage from "./CheckoutOverviewPage";

export default class InformationPage extends BasePage{

    /* Locators */
    private readonly FIRST_NAME = '#first-name'
    private readonly LAST_NAME = '#last-name'
    private readonly ZIP_CODE = '#postal-code'
    private readonly ERROR_MESSAGE = '[data-test="error"]'
    private readonly CONTINUE = '#continue'

    async init(): Promise<this> {
        return this
    }

    async setFirstName(firstName: string): Promise<InformationPage>{
        await this.page.locator(this.FIRST_NAME).fill(firstName)
        return this
    }

    async setLastName(lastName: string): Promise<InformationPage>{
        await this.page.locator(this.LAST_NAME).fill(lastName)
        return this
    }

    async setZipCode(zipCode: string): Promise<InformationPage>{
        await this.page.locator(this.ZIP_CODE).fill(zipCode)
        return this
    }

    async getErrorMessage(): Promise<string>{
        return await this.page.locator(this.ERROR_MESSAGE).innerText()
    }

    async clickContinue(): Promise<CheckoutOverviewPage>{
        await this.page.locator(this.CONTINUE).click()
        return await new CheckoutOverviewPage(this.page).init()
    }
}