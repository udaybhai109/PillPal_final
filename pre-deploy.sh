#!/bin/bash
# Pre-deployment checklist

echo "🚀 Starting PillPal Pre-Deployment Validation..."
echo ""

# Check Node version
echo "✓ Checking Node.js version..."
node --version

# Install dependencies
echo ""
echo "✓ Installing dependencies..."
npm ci

# Type checking
echo ""
echo "✓ Running TypeScript type checking..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed!"
  exit 1
fi

# Linting
echo ""
echo "✓ Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint check failed!"
  exit 1
fi

# Testing
echo ""
echo "✓ Running tests..."
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed!"
  exit 1
fi

# Build
echo ""
echo "✓ Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo ""
echo "✅ All checks passed! Ready for deployment."
echo ""
echo "Next steps:"
echo "1. Review the dist/ folder"
echo "2. Deploy to your hosting service"
echo "3. Set GEMINI_API_KEY in production environment"
