

To run all tests: 
    npx playwright test
To run a single test:
    npx playwright test testcases/onlineportal/farmers/enrollSubSSPortalRegisterDeviceTotalProtect.spec.js
To run test with custom script: 
    npm run test:<scriptName> 
    Example: npm run test:farmersenroll:dynamic --count=13
To run tagged test: 
    npx playwright test --grep @smoke
To run tagged test along with custom scripts: 
    npm run test:farmersenroll -- --grep @TestDataGeneratorFarmers
To generate allure report: 
    allure generate ./allure-results -o ./allure-report --clean
To open the generated allure report:
    allure open allure-report"# AIUpskilling" 
