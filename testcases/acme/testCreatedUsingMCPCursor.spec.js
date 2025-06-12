import { test, expect } from '@playwright/test';
import { AcmeLoginPage } from '../../pages/acme/acmeLoginPage.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load test data from JSON file with the same name as the spec file
const testDataPath = join(__dirname, '../../test-data/acme/testCreatedUsingMCPCursor.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));

test.describe('ACME Login Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page, context }) => {
        loginPage = new AcmeLoginPage(page, context);
        await page.goto('https://acme-test.uipath.com/login');
    });

    test('Successful login with valid credentials', async ({ page }) => {
        // Enter valid credentials using page object methods and test data
        await loginPage.enterUserName(testData.validLogin.username);
        await loginPage.enterPassword(testData.validLogin.password);
        await loginPage.clickLoginButton();

        // Verify successful login
        const pageTitle = await page.title();
        await expect(pageTitle).not.toBe('ACME System 1 - Login');
        await expect(page.url()).not.toContain('/login');
    });

    test('Failed login with invalid credentials', async ({ page }) => {
        // Enter invalid credentials using page object methods and test data
        await loginPage.enterUserName(testData.invalidLogin.username);
        await loginPage.enterPassword(testData.invalidLogin.password);
        await loginPage.clickLoginButton();

        // Verify failed login
        const pageTitle = await page.title();
        await expect(pageTitle).toBe('ACME System 1 - Login');
        await expect(page.url()).toContain('/login');
        
        // Verify error message is displayed
        await expect(page.locator('.alert-danger')).toBeVisible();
    });
}); 