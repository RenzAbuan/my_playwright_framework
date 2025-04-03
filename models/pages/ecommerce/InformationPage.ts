import BasePage from "../../../support/pages/BasePage";
import CheckoutOverviewPage from "./CheckoutOverviewPage";

export default class InformationPage extends BasePage{

    /* Locators */
    private readonly FIRST_NAME = "#first-name"
    private readonly LAST_NAME = "#last-name"
    private readonly ZIP_CODE = "#postal-code"
    private readonly CONTINUE = "#continue"

    async init(): Promise<this> {
        return this
    }

    async setFirstName(firstName: string){
        await this.page.locator(this.FIRST_NAME).fill(firstName)
    }

    async setLastName(lastName: string){
        await this.page.locator(this.LAST_NAME).fill(lastName)
    }

    async setZipCode(zipCode: string){
        await this.page.locator(this.ZIP_CODE).fill(zipCode)
    }

    async clickContinue(): Promise<CheckoutOverviewPage>{
        await this.page.locator(this.CONTINUE).click()
        return new CheckoutOverviewPage(this.page).init()
    }
}