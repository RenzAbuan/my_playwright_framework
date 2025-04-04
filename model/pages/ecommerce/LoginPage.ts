import BasePage from "./BasePage";
import HomePage from "./HomePage";

export default class LoginPage extends BasePage{
    /*Locators*/
    private readonly USERNAME = '#user-name'
    private readonly PASSWORD = '#password'
    private readonly LOGIN = '#login-button'
    private readonly LOGIN_FORM = '.login_wrapper'
    private readonly ERROR = '[data-test="error"]'

    async init(): Promise<this> {
        await this.page.waitForLoadState(this.LOAD_STATE)
        await this.isLoginFormVisible()
        return this
    }

    async setUsername(username: string): Promise<LoginPage>{
        await this.page.locator(this.USERNAME).fill(username)
        return this
    }

    async setPassword(password: string): Promise<LoginPage>{
        await this.page.locator(this.PASSWORD).fill(password)
        return this
    }

    async clickLogin(): Promise<HomePage>{
        await this.page.locator(this.LOGIN).click()
        return await new HomePage(this.page).init()
    }

    async getErrorMessage(): Promise<string>{
        return await this.page.locator(this.ERROR).innerText()
    }

    async isLoginFormVisible(): Promise<boolean>{
        return await this.page.locator(this.LOGIN_FORM).isVisible()
    }

    // Grouped steps
    async loginUser(username?: string, password?: string): Promise<HomePage>{
        return await this.setUsername(username ? username : process.env.STANDARD_USERNAME as string)
            .then(_ => _.setPassword(password ? password : process.env.USER_PASSWORD as string))
            .then(_ => this.clickLogin())
    }
}