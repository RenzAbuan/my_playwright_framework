import { Locator } from "playwright-core";
import BasePage from "./BasePage";
import { Product } from "../../data/ecommerce/Products";
import { SortCategory } from "../../enums/ecommerce/SortCategory";
import CartPage from "./CartPage";
import ItemPage from "./ItemPage";

export default class HomePage extends BasePage{

    /*Locators*/
    private readonly PAGE_TITLE = '.title'
    private readonly ITEM_NAME = '.inventory_item_name'
    private readonly ITEM_CONTAINER = '.inventory_item_description'
    private readonly ITEM_DESCRIPTION = '.inventory_item_desc'
    private readonly ITEM_PRICE = '.inventory_item_price'
    
    private readonly ADD_TO_CART = '//button[text()="Add to cart"]'
    private readonly REMOVE_FROM_CART = 'Remove'
    private readonly SORT_PRODUCTS = '.product_sort_container'

    async init(){
        await this.page.waitForLoadState(this.LOAD_STATE)
        return this
    }

    async getPageTitle(): Promise<string>{
        return await this.page.locator(this.PAGE_TITLE).innerText()
    }

    async getItemPrice(itemName: string): Promise<string>{
        return await this.page.locator(this.ITEM_CONTAINER, {hasText: itemName}).locator(this.ITEM_PRICE).innerText()
    }

    async getItemDescription(itemName: string): Promise<string>{
        return await this.page.locator(this.ITEM_CONTAINER, {hasText: itemName}).locator(this.ITEM_DESCRIPTION).innerText()
    }

    async getItemNames(): Promise<string[]>{
        const products = await this.getAllProducts()
        return products.map((product)=> product.name)
    }

    async getItemPrices(): Promise<number[]>{
        const products = await this.getAllProducts()
        return products.map((product)=> parseFloat(product.price.replace('$', '').trim()))
    }

    async getProduct(itemName: string): Promise<Product>{
        return {
            name: itemName,
            description: await this.getItemDescription(itemName),
            price: await this.getItemPrice(itemName)
        }
    }

    async getAllProducts(): Promise<Product[]>{
        const itemElements = await this.page.locator(this.ITEM_CONTAINER).all()
        return await this.extractToProducts(itemElements)
    }

    async getProductsAddedToCart(): Promise<Product[]>{
        const itemElements = await this.page.locator(this.ITEM_CONTAINER, {hasText: this.REMOVE_FROM_CART}).all()
        return await this.extractToProducts(itemElements)
    }

    async clickAddToCart(itemName: string){
        await this.page.locator(this.ITEM_CONTAINER, {hasText: itemName}).locator(this.ADD_TO_CART).click()
    }

    async clickItem(itemName: string): Promise<ItemPage>{
        await this.page.locator(this.ITEM_NAME, {hasText: itemName}).click()
        return new ItemPage(this.page).init()
    }

    async selectSortCategory(sortCategory: SortCategory){
        await this.page.locator(this.SORT_PRODUCTS).selectOption(sortCategory)
    }

    async isSortedFromAtoZ(items: string[]): Promise<boolean>{
        const sortedItems = [...items].sort()
        return JSON.stringify(items) === JSON.stringify(sortedItems)
    }

    async isSortedFromZtoA(items: string[]): Promise<boolean>{
        const sortedItems = [...items].sort((a,b) => b.localeCompare(a))
        return JSON.stringify(items) === JSON.stringify(sortedItems)
    }

    async isSortedFromHighToLow(itemPrices: number[]): Promise<boolean>{
        const sorted = [...itemPrices].sort((a,b) => b - a)
        return JSON.stringify(itemPrices) === JSON.stringify(sorted)
    }

    async isSortedFromLowToHigh(itemPrices: number[]): Promise<boolean>{
        const sorted = [...itemPrices].sort((a,b) => a - b)
        return JSON.stringify(itemPrices) === JSON.stringify(sorted)
    }

    /* private methods */
    private async extractToProducts(itemElements: Array<Locator>): Promise<Product[]>{
        let products: Product[] = []
        for(const item of itemElements){
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
}