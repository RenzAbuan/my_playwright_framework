import { CheckoutCompletePage, HomePage } from "@pages";
import BasePage from "./BasePage";

export default class CheckoutOverviewPage extends BasePage{

    /* Locators */
    private readonly ITEM_SUBTOTAL = '.summary_subtotal_label'
    private readonly ITEM_TOTAL = '.summary_total_label'
    private readonly ITEM_PRICE= '.inventory_item_price'
    private readonly TAX_AMOUNT= '.summary_tax_label'
    private readonly CANCEL = '#cancel'
    private readonly FINISH = '#finish'

    async init(): Promise<this> {
        await this.page.waitForLoadState(this.LOAD_STATE)
        return this
    }

    async calculateItemSubtotal(): Promise<number>{
        let sum = 0
        const itemPrices = await this.page.locator(this.ITEM_PRICE).all()

        for(const itemPrice of itemPrices){
            const price = parseFloat((await itemPrice.innerText()).replace('$', '').trim())
            sum+=price
        }

        return sum
    }

    async calculateItemPricetotal(): Promise<number>{
        return await this.calculateItemSubtotal() + await this.getTax()
    }

    async getItemPriceTotal(): Promise<number>{
        return parseFloat((await this.page.locator(this.ITEM_TOTAL).innerText()).replace('Item total: $', '').trim())
    }

    async getItemSubTotal(): Promise<number>{
        return parseFloat((await this.page.locator(this.ITEM_SUBTOTAL).innerText()).replace('Item total: $', '').trim())
    }

    async getTax(): Promise<number>{
        return parseFloat((await this.page.locator(this.TAX_AMOUNT).innerText()).replace('$', '').trim())
    }

    async clickCancel(): Promise<HomePage>{
        await this.page.locator(this.CANCEL).click()
        return await new HomePage(this.page).init()
    }

    async clickFinish(): Promise<CheckoutCompletePage>{
        await this.page.locator(this.FINISH).click()
        return await new CheckoutCompletePage(this.page).init()
    }
}