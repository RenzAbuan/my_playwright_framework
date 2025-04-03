import BasePage from "../../../support/pages/BasePage";
import HomePage from "./HomePage";

export default class CheckoutCompletePage extends BasePage{

    /* Locators */
    private readonly COMPLETE_HEADER = '.complete-header'
    private readonly COMPLETE_TEXT = '.complete-text'
    private readonly BACK_HOME= '#back-to-products'

    async init(): Promise<this> {
        return this
    }

    async getMessageHeader(): Promise<string>{
        return await this.page.locator(this.COMPLETE_HEADER).innerText()
    }

    async getMessageText(): Promise<string>{
        return await this.page.locator(this.COMPLETE_TEXT).innerText()
    }

    async clickBackHome(): Promise<HomePage>{
        await this.page.locator(this.BACK_HOME).click()
        return new HomePage(this.page).init()
    }
}