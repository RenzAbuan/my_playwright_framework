import BasePage from "../../support/pages/BasePage";
import { SortCategory } from "../enums/SortCategory";

export default class HomePage extends BasePage{

    /*Locators*/
    private readonly PAGE_TITLE = '.title'
    private readonly ITEM_NAME = '.inventory_item_name'
    private readonly ITEM_DESCRIPTION = '.inventory_item_description'
    private readonly ITEM_PRICE = '.inventory_item_price'
    
    private readonly ADD_TO_CART = '//button[text()="Add to cart"]'
    private readonly SHOPPING_CART = '.shopping_cart_link'
    private readonly SORT_PRODUCTS = '.product_sort_container'

    async init(){
        return this
    }

    async getPageTitle(): Promise<string>{
        return await this.page.locator(this.PAGE_TITLE).innerText()
    }

    async getItems(): Promise<string[]>{
        let itemNames: string[] = []
        const itemElements = await this.page.locator(this.ITEM_NAME).all()

        for(const itemElement of itemElements){
            itemNames.push(await itemElement.innerText())
        }

        return itemNames
    }

    async getItemPrices(): Promise<number[]>{
        let itemPrices: number[] = []
        const itemElements = await this.page.locator(this.ITEM_PRICE).all()
        
        for(const itemElement of itemElements){
            let parsedItemElement = await itemElement.textContent()
            if(parsedItemElement){
                itemPrices.push(parseFloat(parsedItemElement.replace('$', '').trim()))
            }
        }

        return itemPrices
    }

    async clickAddToCart(itemName: string){
        await this.page.locator(this.ITEM_DESCRIPTION, {hasText: itemName}).locator(this.ADD_TO_CART).click()
    }

    async clickShoppingCart(){
        await this.page.locator(this.SHOPPING_CART).click()
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
}