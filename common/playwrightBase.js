/**
 * @typedef {import('@playwright/test').Page} Page
 * @typedef {import('@playwright/test').Locator} Locator
 * @typedef {import('@playwright/test').BrowserContext} BrowserContext
 */

import {test, expect} from "@playwright/test";
import {LOCATOR_TYPE, ACTION_NAME} from '../test-data/constants/constants.js'

export class PlaywrightBase {
    /**
     * @param {Page} page
     * @param {BrowserContext} context
     */
    constructor(page, context) {
        this.page = page;
        this.context = context;
    }

    async navigate(url) {
        await this.page.goto(url);
    }

    /**
     * Types into the specified textbox, clears existing text, and presses <ENTER>.
     * @param {string} locator - The locator for the textbox element.
     * @param {string} elementName - The name of the textbox element.
     * @param {string} elementType - The type of the element
     * @param {string} data - The data to be typed into the textbox.
     */
    async fill(locator, elementName, elementType, data) {
        await test.step(`Fill ${elementName} ${elementType} with data: ${data}`, async () => {
            await this.page.focus(locator)
            await this.page.locator(locator).clear();
            await this.page.fill(locator, data, { force: true })
        });
    }

    /**
     * Clicks on the web element.
     * @param {string} locator - The locator for the element
     * @param {string} elementName - The name of the element
     * @param {string} elementType - The type of the element
     */
    async click(locator, elementName, elementType) {
        await test.step(`Click on the ${elementName} ${elementType}`, async () => {
            await this.page.locator(locator).click();
        });
    }

    async getText(selector) {
        return await this.page.textContent(selector);
    }

    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }

    async waitForElement(selector) {
        await this.page.waitForSelector(selector);
    }

    /**
     * Types into the specified textbox, clears existing text, and presses <ENTER>.
     * @param {string} locator - The locator for the textbox element.
     * @param {string} elementName - The name of the textbox element.
     * @param {string} elementType - The type of the element
     */
    async validateElementVisibility(locator, elementName, elementType) {
        try {
            await test.step(`Element ${elementName} ${elementType} is visible`, async () => {
                await this.page.waitForSelector(locator, { state: 'attached', timeout: 30000, strict: true });
                await this.page.locator(locator).isVisible();
            });
        } catch (error) {
            console.error(`Error validating visibility of ${elementName}: ${error}`);
        }
    }

    /**
     * Switches to a new window that opens after clicking an element and brings it to the front.
     * 
     * @param {string} windowTitle - The title of the window to switch to.
     * @param {string} locator - The locator for the element to click that opens the new window.
     * @returns {Promise<Page | null>} - The new window with the specified title, or null if not found.
     */
    async switchToWindow(locator, windowTitle, elementName, elementType) {
        const [newPage] = await Promise.all([
            this.context.waitForEvent('page'),
            this.page.locator(locator).click()
        ]);

        await newPage.waitForLoadState('load');
        const title = await newPage.title();
        console.log("New page Title: " + title);
        const pages = newPage.context().pages();
        for (const page of pages) {
            console.log("No of pages: " + pages.length);
            console.log("Title: " + page.title());
            if (await page.title() === windowTitle) {
                await page.bringToFront();
                return page;
            }
        }

        console.log(`No page found with title: ${windowTitle}`);
        return null;
    }

    /**
     * Clicks an element inside a frame if it exists, otherwise clicks the element in the main page.
     * 
     * @param {string} frameLocator - The selector for the frame.
     * @param {string} locator - The selector for the element inside the frame.
     * @param {string} name - The name of the element (used for logging).
     * @param {string} type - The type of the element (used for logging).
     * @param {number} [index=0] - Optional index of the element if there are multiple matches.
     */
    async clickinFrame(frameLocator, locator, name, type, index = 0) {
        await test.step(`The ${type} ${name} clicked`, async () => {
            const frameEle = this.page.frameLocator(frameLocator);
            const elementCount = await frameEle.locator(locator).count();
            if (elementCount > 0) {
                await frameEle.locator(locator).nth(index).click({ force: true });
            } else {
                await this.page.locator(locator).click();
            }
        });
    }

    /**
     * Accepts an alert dialog and optionally sends data if provided.
     * 
     * @param {string} [Data] - Optional text to send with the alert accept.
     */
    async acceptAlert(Data) {
        this.page.on("dialog", async (dialog) => {
            console.log('Dialog Message:', dialog.message());
            await dialog.accept(Data);
        });
    }
}
