import BasePage from "./BasePage";
import { Product } from "../../data/ecommerce/Products";
import CartPage from "./CartPage";

export default class ItemPage extends BasePage{

    /* Locators */
    private readonly REMOVE = '#remove'
    private readonly ITEM_NAME = '.inventory_details_name'
    private readonly ITEM_DESCRIPTION = '.inventory_details_desc'
    private readonly ITEM_PRICE = '.inventory_details_price'
    private readonly ADD_TO_CART = '#add-to-cart'

    async init(): Promise<this> {
        return this
    }

    async getProduct(): Promise<Product>{
        return {
            name: await this.page.locator(this.ITEM_NAME).innerText(),
            description: await this.page.locator(this.ITEM_DESCRIPTION).innerText(),
            price: await this.page.locator(this.ITEM_PRICE).innerText(),
        }
    }

    async clickAddToCart(): Promise<ItemPage>{
        await this.page.locator(this.ADD_TO_CART).click()
        return this
    }
}