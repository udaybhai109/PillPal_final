# Environment Variables Guide

## Development (.env.local)
```
GEMINI_API_KEY=your-development-key-here
```

## Production Deployment
Before deploying to production, ensure you have:

1. **Gemini API Key** - Set `GEMINI_API_KEY` in your hosting platform:
   - Vercel: Add to Environment Variables
   - Netlify: Add to Build & Deploy settings
   - AWS: Set in Lambda environment or Secrets Manager
   - Azure: Use Key Vault

2. **Browser API Access**
   - Camera permission (for prescription scanning)
   - localStorage (for medication data persistence)

3. **Security Considerations**
   - Never commit `.env.local` to Git
   - Use strong, unique API keys in production
   - Implement HTTPS only
   - Consider adding authentication/authorization
   - Sanitize user inputs from AI responses

## Testing the Environment
```bash
# Local testing
npm run validate

# Production simulation
npm run build
npm run preview
```

## Deployment Checklist
- [ ] API key configured
- [ ] All tests passing (`npm run test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Environment variables set in hosting platform
- [ ] CORS configured if using external APIs
- [ ] Error handling tested
- [ ] Performance optimized (check `dist/` size)
