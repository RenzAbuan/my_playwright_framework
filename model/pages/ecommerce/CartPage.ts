import BasePage from "./BasePage";
import { Product } from "../../data/ecommerce/Products";
import InformationPage from "./InformationPage";

export default class CartPage extends BasePage{

    /* Locators */
    private readonly CART_LIST = '.cart_list'
    private readonly CART_ITEM = '.cart_item'
    private readonly REMOVE = '//button[text()="Remove"]'
    private readonly ITEM_NAME = '.inventory_item_name'
    private readonly ITEM_DESCRIPTION = '.inventory_item_desc'
    private readonly ITEM_PRICE = '.inventory_item_price'
    private readonly CHECKOUT = '#checkout'

    async init(): Promise<this> {
        return this
    }

    async removeItem(itemName: string): Promise<CartPage>{
        await this.page.locator(this.CART_ITEM, {hasText: itemName}).locator(this.REMOVE).click()
        return this
    }

    async getProductsInCart(): Promise<Product[]>{
        const items = await this.page.locator(this.CART_ITEM).all()
        let products: Product[] = []
        for(const item of items){
            const itemName = await item.locator(this.ITEM_NAME).innerText()
            const product: Product = {
                name: itemName,
                price: await this.getItemPrice(itemName),
                description: await this.getItemDescription(itemName)
            }
            products.push(product)
        }
        return products
    }

    async getItemDescription( itemName: string): Promise<string>{
        return await this.page.locator(this.CART_ITEM, {hasText: itemName}).locator(this.ITEM_DESCRIPTION).innerText()
    }

    async getItemPrice( itemName: string): Promise<string>{
        return await this.page.locator(this.CART_ITEM, {hasText: itemName}).locator(this.ITEM_PRICE).innerText()
    }

    async clickCheckout(): Promise<InformationPage>{
        await this.page.locator(this.CHECKOUT).click()
        return new InformationPage(this.page).init()
    }

    async isItemInCart(itemName: string): Promise<boolean>{
        return (await this.page.locator(this.CART_LIST, {hasText: itemName}).all()).length > 0
    }
}