# PillPal Testing Guide

## Quick Test Commands

### 1. **Run All Tests** (Recommended First)
```bash
npm run test -- --run
```
This runs all unit and component tests once.

### 2. **Watch Mode** (During Development)
```bash
npm run test
```
Tests re-run automatically when files change.

### 3. **Visual Test UI**
```bash
npm run test:ui
```
Opens interactive test dashboard in browser.

### 4. **Coverage Report**
```bash
npm run test:coverage
```
Generates detailed coverage statistics.

### 5. **Full Validation** (Before Deployment)
```bash
npm run validate
```
Runs type-check + lint + tests sequentially.

### 6. **Pre-Deployment Check**
```bash
npm run deploy:check
```
Complete validation including build.

---

## What Each Test Checks

### Type Check (`npm run type-check`)
- ✅ TypeScript syntax errors
- ✅ Type mismatches
- ✅ Unused variables
- ✅ Interface compliance

### Linting (`npm run lint`)
- ✅ Code style issues
- ✅ React hooks best practices
- ✅ Unused imports
- ✅ Security issues

### Unit Tests
**Service Tests** (`services/geminiService.test.ts`)
- Prescription parsing validation
- Drug interaction checking
- Error handling

**Component Tests** (`components/Scanner.test.tsx`)
- Scanner UI rendering
- Camera functionality
- File upload handling

---

## Running Tests in VS Code

### Method 1: Test Explorer (Recommended)
1. Install "Vitest" extension
2. Click "Testing" icon in sidebar (flask icon)
3. View all tests in tree structure
4. Click run button next to each test
5. View inline results and coverage

### Method 2: Command Palette
1. Press `Ctrl+Shift+P`
2. Type "Test: Run All Tests"
3. View results in terminal

### Method 3: Terminal
Open VS Code terminal (`Ctrl+``), then run commands above.

---

## Test Results Explained

### ✅ Passing Test
```
✓ geminiService › parsePrescription (12ms)
```
Test ran successfully.

### ❌ Failed Test
```
✗ Scanner › should render scanner with title
  Expected: "Prescription Scan"
  Received: undefined
```
Need to fix the code or test.

### ⏭️ Skipped Test
```
○ Scanner › should have capture button
```
Test marked to skip (use `.only` to run specific tests).

---

## Common Test Issues & Solutions

### Issue: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -r node_modules
npm install
```

### Issue: "Tests not found"
```bash
# Solution: Check vitest.config.ts
npm run test -- --reporter=verbose
```

### Issue: "localStorage is not defined"
- Already mocked in `vitest.setup.ts`
- Verify setup file is included in config

### Issue: "navigator.mediaDevices is not mocked"
- Tests use jsdom which doesn't support camera
- Mock it or skip camera-dependent tests

---

## Code Coverage

After running `npm run test:coverage`, check:
- `coverage/coverage-final.json` - Machine readable
- `coverage/index.html` - Open in browser for visual report

**Coverage Goals:**
- Statements: > 70%
- Branches: > 60%
- Functions: > 70%
- Lines: > 70%

---

## Writing New Tests

### Test Template
```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Testing Components
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
```

---

## Continuous Integration

Tests run automatically on:
- Every push (GitHub Actions)
- Pull requests
- Before deployment

Check `.github/workflows/deploy.yml` for CI/CD config.

---

## Quick Reference

| Command | Purpose | Time |
|---------|---------|------|
| `npm run test` | Watch mode tests | <1s per test |
| `npm run test -- --run` | Single run | ~5-10s |
| `npm run test:ui` | Visual dashboard | Opens browser |
| `npm run test:coverage` | Coverage report | ~10-15s |
| `npm run type-check` | Type validation | ~2-3s |
| `npm run lint` | Code quality | ~1-2s |
| `npm run validate` | All checks | ~20-30s |
| `npm run deploy:check` | Pre-deploy check | ~40-60s |

---

## Tips

✅ Run tests in watch mode while developing
✅ Always run `npm run validate` before committing
✅ Check coverage reports for gaps
✅ Use `.only` to debug single tests: `it.only('test'...)`
✅ Use `.skip` to disable tests: `it.skip('test'...)`
✅ Check CI/CD logs if tests pass locally but fail in GitHub

---

## Next Steps

After tests pass:
1. Review code coverage
2. Fix any lint warnings
3. Run `npm run deploy:check`
4. Deploy to production
5. Monitor app in production
