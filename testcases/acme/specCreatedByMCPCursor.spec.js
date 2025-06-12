import { test, expect } from '@playwright/test';
import { AcmeLoginPage } from '../../pages/acme/acmeLoginPage';
import { config } from '../../configs/client-config';
import testData from '../../test-data/acme/specCreatedByMCPCursor.json' assert { type: 'json' };

test.describe('ACME Login Tests', () => {
    let acmeLoginPage;

    test.beforeEach(async ({ page, context }) => {
        acmeLoginPage = new AcmeLoginPage(page, context);
        await acmeLoginPage.navigate(config.baseUrl);
    });

    test('should login successfully with valid credentials', async () => {
        await acmeLoginPage.login(
            testData.validCredentials.email,
            testData.validCredentials.password
        );
        expect(await acmeLoginPage.isLoggedIn()).toBeTruthy();
    });

    for (const invalidCase of testData.invalidCredentials) {
        test(`should show error with invalid credentials: ${invalidCase.email}`, async () => {
            await acmeLoginPage.login(invalidCase.email, invalidCase.password);
        });
    }
}); 