import BasePage from "../../support/pages/BasePage";

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

    async clickLogin(){
        await this.page.locator(this.LOGIN).click()
    }
}