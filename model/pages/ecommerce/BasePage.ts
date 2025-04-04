import { Page } from "@playwright/test"

export default abstract class BasePage {
    protected page: Page

    constructor(page: Page){
        this.page = page
    }

    abstract init(): Promise<this>

    protected readonly LOAD_STATE = 'domcontentloaded'

    /* Locators */
    private readonly MENU = '#react-burger-menu-btn'
    private readonly ALL_ITEMS_MENU = '#inventory_sidebar_link'
    private readonly ABOUT_MENU = '#about_sidebar_link'
    private readonly LOGOUT_MENU = '#logout_sidebar_link'
    private readonly RESET_APP_STATE_MENU = '#reset_sidebar_link'
    private readonly SHOPPING_CART = '.shopping_cart_link'

    async openMenu():Promise<BasePage>{
        await this.page.locator(this.MENU).click()
        return this
    }

    async clickAllItemsMenu():Promise<BasePage>{
        await this.page.locator(this.ALL_ITEMS_MENU).click()
        return this
    }

    async clickAboutMenu(){
        await this.page.locator(this.ABOUT_MENU).click()
    }

    async clickLogoutMenu():Promise<BasePage>{
        await this.page.locator(this.LOGOUT_MENU).click()
        return this
    }

    async clickResetAppStateMenu():Promise<BasePage>{
        await this.page.locator(this.RESET_APP_STATE_MENU).click()
        return this
    }

    async clickShoppingCart():Promise<BasePage>{
        await this.page.locator(this.SHOPPING_CART).click()
        return this
    }
}