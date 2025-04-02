import BasePage from "../../support/pages/BasePage";

export default class CartPage extends BasePage{

    /* Locators */
    private readonly CART_LIST = '.cart_list'

    async init(): Promise<this> {
        return this
    }

    async isItemAddedToCart(itemName: string): Promise<boolean>{
        return (await this.page.locator(this.CART_LIST, {hasText: itemName}).all()).length > 0
    }
}