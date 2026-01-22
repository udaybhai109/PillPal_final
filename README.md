# PillPal - Smart Medication Assistant

A React/TypeScript web application for managing medications, scanning prescriptions, and checking drug interactions.

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/udaybhai109/PillPal_final.git
cd PillPal_final
npm install
```

### 2. Development
```bash
npm run dev
# Visit http://localhost:5173
```

### 3. Testing
```bash
npm run test              # Run tests
npm run test:ui          # Interactive test dashboard
npm run validate         # Full validation (types + lint + tests)
```

### 4. Production Build
```bash
npm run build
npm run deploy:check
```

## Deployment Options

- **Web:** Deploy `dist/` to Vercel, Netlify, or GitHub Pages
- **Mobile Web:** Access via browser on Android/iOS
- **Native Android:** Use Capacitor (see [ANDROID_DEPLOYMENT.md](ANDROID_DEPLOYMENT.md))

## Setup

Create `.env.local`:
```
VITE_GEMINI_API_KEY=your-api-key
```

Get API key from: https://ai.google.dev/

## Documentation

- [ANDROID_DEPLOYMENT.md](ANDROID_DEPLOYMENT.md) - Deploy to Android/Android Studio
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing documentation
- [ENV_GUIDE.md](ENV_GUIDE.md) - Environment setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

## Tech Stack

- React 18.3
- TypeScript 5.8
- Vite 6.2
- Vitest for testing
- Tailwind CSS (assumed from styling)
