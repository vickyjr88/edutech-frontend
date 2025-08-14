# Testing Stack Documentation

This project uses a Vite-native testing stack optimized for React applications with TypeScript.

## Testing Tools

### Unit & Integration Tests
- **Vitest** - Fast unit/integration test runner with native Vite support
- **@testing-library/react** - Simple and complete React DOM testing utilities
- **@testing-library/user-event** - Fire events for better user interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers for DOM elements

### API Mocking
- **MSW (Mock Service Worker)** - Seamless REST/GraphQL API mocking library

### E2E Testing
- **Playwright** - Cross-browser end-to-end testing with video/trace output

### Coverage
- **@vitest/coverage-v8** - Built-in code coverage with V8 provider

## Available Scripts

```bash
# Run unit/integration tests with coverage
npm run test

# Run tests in watch mode (development)
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run all tests (CI pipeline)
npm run test:ci

# Pre-commit checks (lint + test)
npm run pre-commit
```

## Project Structure

```
├── src/
│   ├── test/
│   │   ├── setup.ts              # Vitest setup with Testing Library
│   │   ├── example.test.tsx      # Example component test
│   │   ├── api.test.ts          # Example API integration test
│   │   └── mocks/
│   │       ├── handlers.ts       # MSW API handlers
│   │       ├── server.ts        # MSW server for Node.js tests
│   │       └── browser.ts       # MSW worker for browser tests
├── e2e/
│   └── example.spec.ts          # Example Playwright E2E test
├── vitest.config.ts             # Vitest configuration
├── playwright.config.ts         # Playwright configuration
├── .env.test                    # Test environment variables
└── .env.e2e                     # E2E environment variables
```

## Configuration Files

### Vitest Configuration (`vitest.config.ts`)
- Configured for React/JSX support
- JSDOM environment for DOM testing
- Path aliases matching your Vite config
- Coverage reporting with V8 provider

### Playwright Configuration (`playwright.config.ts`)
- Cross-browser testing (Chrome, Firefox, Safari)
- Video recording on failure
- Screenshot capture
- Trace collection for debugging
- Dev server integration

### Environment Files
- `.env.test` - Safe defaults for unit/integration tests
- `.env.e2e` - Safe defaults for E2E tests
- Never commit real secrets to these files

## Writing Tests

### Unit Tests
```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### API Integration Tests
```typescript
import { describe, it, expect } from 'vitest'

describe('API Tests', () => {
  it('should fetch data', async () => {
    const response = await fetch('/api/data')
    expect(response.status).toBe(200)
  })
})
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test'

test('should navigate correctly', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Login')
  await expect(page).toHaveURL('/login')
})
```

## Best Practices

1. **Use MSW for API mocking** - More reliable than mocking fetch/axios
2. **Test user behavior, not implementation** - Focus on what users see/do
3. **Keep tests independent** - Each test should be able to run in isolation
4. **Use meaningful test descriptions** - Describe the expected behavior
5. **Leverage coverage reports** - Aim for high coverage but focus on critical paths

## Coverage Reports

After running tests with coverage, view the HTML report:
```bash
open coverage/index.html
```

## Debugging

### Vitest
```bash
# Debug specific test file
npx vitest run src/test/example.test.tsx --reporter=verbose

# Debug with UI
npx vitest --ui
```

### Playwright
```bash
# Run in headed mode
npx playwright test --headed

# Debug mode
npx playwright test --debug

# View test reports
npx playwright show-report
```
