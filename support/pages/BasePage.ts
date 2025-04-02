import { Page } from "@playwright/test";

export default abstract class BasePage{
    protected page: Page

    constructor(page: Page){
        this.page = page
    }
    
    abstract init(): Promise<this>
}