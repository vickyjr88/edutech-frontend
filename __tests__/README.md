# Testing Setup and Conventions

This directory contains the test files for the application. The testing setup uses **Vitest** for unit and component tests with **jsdom** environment for DOM-related testing.

## Structure

```
__tests__/
├── README.md                    # This file - testing documentation
├── integrations/
│   └── api/
│       └── client.test.ts       # API client tests
└── components/                  # Component tests (add as needed)
    └── [component-name].test.tsx

src/
├── tests/
│   └── setup.ts                # Test setup file
└── test/                       # Existing test utilities
    ├── setup.ts               # Original setup (being replaced)
    └── mocks/
        ├── server.ts          # MSW server setup
        ├── handlers.ts        # MSW request handlers
        └── api-handlers.ts    # API-specific handlers
```

## Configuration

### Vitest Config (`vitest.config.ts`)

The Vitest configuration extends the base Vite configuration and includes:

- **Environment**: `jsdom` for DOM testing
- **Global**: Test globals enabled (no need to import `describe`, `it`, `expect`)
- **Setup Files**: `./src/tests/setup.ts` for test initialization
- **Coverage**: Text and LCOV reporters with 85% statement coverage threshold

### Test Setup (`src/tests/setup.ts`)

The setup file configures:

- **Testing Library**: Extends expect with jest-dom matchers
- **MSW**: Mock Service Worker for API mocking
- **DOM Mocks**: Common browser APIs like `matchMedia` and `ResizeObserver`
- **Cleanup**: Automatic cleanup after each test

## Testing Patterns

### Unit Tests

Place unit tests in the `__tests__/` directory following the source code structure:

```typescript
// __tests__/integrations/api/client.test.ts
import { describe, it, expect, vi } from 'vitest';
import { api } from '@/integrations/api/client';

describe('ApiClient', () => {
  it('should make successful requests', async () => {
    const result = await api.get('/test');
    expect(result.data).toBeDefined();
    expect(result.error).toBeNull();
  });
});
```

### Component Tests

For React component tests, use Testing Library:

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### API Mocking

MSW handlers are configured to mock API endpoints:

```typescript
// Tests automatically use MSW mocks
const result = await api.post('/auth/login', {
  email: 'test@example.com',
  password: 'password'
});
// This will use the mocked response from api-handlers.ts
```

### Mocking External Dependencies

Use Vitest's `vi.mock()` for mocking modules:

```typescript
import { vi } from 'vitest';

// Mock an entire module
vi.mock('@/services/external-service', () => ({
  externalFunction: vi.fn().mockReturnValue('mocked-value')
}));

// Mock specific functions
const mockFn = vi.fn();
vi.mocked(originalFunction).mockImplementation(mockFn);
```

## Running Tests

```bash
# Run tests once with coverage
npm run test

# Watch mode for development  
npm run test:watch

# Run with coverage report
npm run test -- --coverage

# Run specific test file
npm run test -- client.test.ts

# Run tests matching pattern
npm run test -- --grep "API"
```

## Coverage Requirements

The project is configured with a coverage threshold of 85% for statements. Tests will fail if coverage falls below this threshold.

## Best Practices

1. **Descriptive Test Names**: Use clear, descriptive names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests clearly with setup, execution, and assertion phases
3. **Mock External Dependencies**: Mock all external services and APIs to ensure isolated testing
4. **Test Edge Cases**: Include tests for error conditions and edge cases
5. **Clean Setup/Teardown**: Use `beforeEach`/`afterEach` hooks for test isolation
6. **Type Safety**: Leverage TypeScript for type-safe testing

## Debugging Tests

- Use `test.only()` or `describe.only()` to run specific tests
- Add `console.log()` statements for debugging (remember to remove them)
- Use the `--reporter=verbose` flag for detailed test output
- Check MSW console logs for API request/response debugging
