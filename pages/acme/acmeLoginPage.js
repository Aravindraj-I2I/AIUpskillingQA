/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 * @typedef {import('@playwright/test').BrowserContext} BrowserContext
 */

import { PlaywrightBase } from '../../common/playwrightBase';
import { ACME_ELEMENT_NAME, ELEMENT_TYPE } from '../../test-data/constants/constants';

export class AcmeLoginPage extends PlaywrightBase {
    constructor(page, context) {
        super(page, context);
        this.userName = "//input[@id='email']";
        this.password = "//input[@id='password']";
        this.loginButton = "//button[contains(text(),'Login')]";
        this.errorMessage = "//div[contains(@class,'alert-danger')]";
        this.logoutText = "//a[contains(text(),'Log Out')]";
    }

    async login(email, password) {
        await this.fill(this.userName, ACME_ELEMENT_NAME.USER_NAME, ELEMENT_TYPE.TEXTBOX, email);
        await this.fill(this.password, ACME_ELEMENT_NAME.PASSWORD, ELEMENT_TYPE.TEXTBOX, password);
        await this.click(this.loginButton, ACME_ELEMENT_NAME.LOGIN_BUTTON, ELEMENT_TYPE.BUTTON);
    }

    async getErrorMessage() {
        await this.validateElementVisibility(this.errorMessage, 'Error Message', ELEMENT_TYPE.TEXT);
        return await this.getText(this.errorMessage);
    }

    async isLoggedIn() {
        return await this.isVisible(this.logoutText);
    }
}