import BasePage from "../../../support/pages/BasePage";
import CheckoutCompletePage from "./CheckoutCompletePage";

export default class CheckoutOverviewPage extends BasePage{

    /* Locators */
    private readonly ITEM_SUBTOTAL = '.summary_subtotal_label'
    private readonly ITEM_TOTAL = '.summary_total_label'
    private readonly ITEM_PRICE= '.inventory_item_price'
    private readonly TAX_AMOUNT= '.summary_tax_label'
    private readonly FINISH = '#finish'

    async init(): Promise<this> {
        return this
    }

    async calculateItemSubtotal(): Promise<number>{
        let sum = 0
        const itemPrices = await this.page.locator(this.ITEM_PRICE).all()

        for(const itemPrice of itemPrices){
            const price = parseFloat((await itemPrice.textContent() as string).replace('$', '').trim())
            sum+=price
        }

        return sum
    }

    async calculateItemPricetotal(): Promise<number>{
        return await this.calculateItemSubtotal() + await this.getTax()
    }

    async getItemPriceTotal(): Promise<number>{
        return parseFloat((await this.page.locator(this.ITEM_TOTAL).textContent() as string).replace('Item total: $', '').trim())
    }

    async getItemSubTotal(): Promise<number>{
        return parseFloat((await this.page.locator(this.ITEM_SUBTOTAL).textContent() as string).replace('Item total: $', '').trim())
    }

    async getTax(): Promise<number>{
        return parseFloat((await this.page.locator(this.TAX_AMOUNT).textContent() as string).replace('$', '').trim())
    }

    async clickFinish(): Promise<CheckoutCompletePage>{
        await this.page.locator(this.FINISH).click()
        return new CheckoutCompletePage(this.page).init()
    }
}