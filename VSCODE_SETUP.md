# VS Code Extensions & Setup Guide

## Recommended VS Code Extensions

### Install these for optimal development:

1. **Vitest** (vitest.explorer)
   - Run tests directly in VS Code
   - Visual test explorer
   - Coverage indicators

2. **ESLint** (dbaeumer.vscode-eslint)
   - Real-time linting
   - Auto-fix on save
   - Integration with editor

3. **Prettier** (esbenp.prettier-vscode)
   - Code formatting
   - Auto-format on save
   - Consistent style

4. **TypeScript Vue Plugin** (Vue.vscode-typescript-vue-plugin)
   - Better TypeScript support
   - IntelliSense improvements

5. **React Hooks Snippets** (dsznajder.es7-react-js-snippets)
   - Quick React component creation
   - Hook snippets

## VS Code Settings (.vscode/settings.json)

Create a `.vscode/settings.json` file:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "vitest.enable": true,
  "vitest.commandLine": "vitest"
}
```

## Running Tests in VS Code

### Option 1: Test Explorer (Via Vitest Extension)
1. Install Vitest extension
2. Click "Testing" icon in left sidebar
3. Click "Run All" or select individual tests
4. View coverage and results inline

### Option 2: Terminal
```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Option 3: Debug Tests
1. Open test file
2. Set breakpoints (F9)
3. Right-click test name → "Debug Test"
4. Use VS Code debugger

## Pre-deployment Commands

Run these sequentially in VS Code terminal:

```bash
# 1. Type check
npm run type-check

# 2. Lint
npm run lint

# 3. Tests
npm run test

# 4. Build
npm run build

# 5. Preview
npm run preview
```

Or use single command:
```bash
npm run deploy:check
```

## Keyboard Shortcuts

- `Ctrl+Shift+B` - Run build task
- `Ctrl+Shift+T` - Run test
- `Ctrl+Shift+L` - Format document (if Prettier installed)
- `Ctrl+Shift+P` - Command palette (search for test commands)

## Common Issues & Fixes

### Issue: Tests not found
```bash
npm run test -- --reporter=verbose
```

### Issue: ESLint not working
```bash
# Reinstall eslint
npm install --save-dev eslint
npm run lint:fix
```

### Issue: Module not found in tests
- Check `vitest.config.ts` paths
- Ensure imports use correct path aliases
- Rebuild: `npm run build`

### Issue: localStorage errors in tests
- Vitest setup file mocks localStorage
- Check `vitest.setup.ts`
