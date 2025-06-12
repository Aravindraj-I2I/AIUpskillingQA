
# AIUpskilling

Automated testing framework built using [Playwright](https://playwright.dev/) for the AIUpskilling platform.  
This project supports dynamic test execution, tagging, custom scripts, and reporting with Allure.

---

## Getting Started

### 🛠️ Install dependencies

```bash
npm install
```

---

## Test Execution Commands

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test testcases/acme/specCreatedByMCPCursor.spec.js
```

### Run a test with a custom script

```bash
npm run test:<scriptName>
```

 **Example:**

```bash
npm run test:farmersenroll:dynamic --count=13
```

###  Run tagged tests (e.g., smoke)

```bash
npx playwright test --grep @smoke
```

---

## Allure Reporting

### Generate Allure report

```bash
allure generate ./allure-results -o ./allure-report --clean
```

### 🔹 Open the generated Allure report

```bash
allure open allure-report
```

---

## Best Practices

- Tag your test cases appropriately using `@smoke`, `@regression`, etc.
- Keep test data modular for dynamic execution.
- Use environment configs and CLI args for better reusability.

---


---

###  Maintainer

**Aravindraj-I2I**  
GitHub: [github.com/Aravindraj-I2I](https://github.com/Aravindraj-I2I)
