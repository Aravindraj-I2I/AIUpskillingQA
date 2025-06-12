import { test } from '@playwright/test';
import { AcmeLoginPage} from '../../pages/acme/acmeLoginPage.js';

test.describe('ACME Login Tests', () => {
    let loginPage;

    test.beforeEach(async ({ page, context }) => {
        loginPage = new AcmeLoginPage(page, context);
        await page.goto('https://acme-test.uipath.com/login');
    });

    test('should login with valid credentials', async () => {
        await loginPage.enterUserName('your.email@example.com');
        await loginPage.enterPassword('your_password');
        await loginPage.clickLoginButton();
    });

    test('should display error with invalid credentials', async () => {
        await loginPage.enterUserName('invalid@example.com');
        await loginPage.enterPassword('invalid_password');
        await loginPage.clickLoginButton();
    });
});