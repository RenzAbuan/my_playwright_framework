import BasePage from "../../../support/pages/BasePage";
import HomePage from "./HomePage";

export default class LoginPage extends BasePage{
    /*Locators*/
    private readonly USERNAME = '#user-name'
    private readonly PASSWORD = '#password'
    private readonly LOGIN = '#login-button'

    async init(): Promise<this> {
        return this
    }

    async setUsername(username: string){
        await this.page.locator(this.USERNAME).fill(username)
    }

    async setPassword(password: string){
        await this.page.locator(this.PASSWORD).fill(password)
    }

    async clickLogin(): Promise<HomePage>{
        await this.page.locator(this.LOGIN).click()
        return new HomePage(this.page).init()
    }
}