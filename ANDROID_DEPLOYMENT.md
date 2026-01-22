# Using PillPal in Android Studio

This is a **web-based React app**, not a native Android app. However, there are multiple ways to run it on Android:

## Option 1: Mobile Web (Easiest) ✅ RECOMMENDED

Simply open the web version in your phone browser:
```
https://github.com/udaybhai109/PillPal_final
→ Deploy via Vercel/Netlify
→ Open URL on Android device
```

**Pros:** No native compilation needed, automatic updates
**Cons:** Requires internet connection

---

## Option 2: Convert to Native Android App (Capacitor)

Convert this React web app to a native Android app using **Capacitor**:

### Installation
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm run build
npx cap add android
```

### Build APK
```bash
cd android
./gradlew assembleRelease
# APK will be in: android/app/release/app-release.apk
```

**Pros:** Native app, works offline (with modifications), can access camera/sensors
**Cons:** Requires Android SDK, larger download

---

## Option 3: Wrap in WebView (Cordova)

Package the web app as a WebView wrapper:

```bash
npm install -g cordova
cordova create PillPal-Mobile
cordova plugin add cordova-plugin-camera
cordova platform add android
cordova build android
```

**Pros:** Simple, maintains web tech stack
**Cons:** Less integrated with Android

---

## Option 4: Use Android Studio's Built-in Browser

**In Android Studio:**
1. Create Android Emulator or connect device
2. Open Chrome/Firefox in emulator
3. Navigate to: `http://your-laptop-ip:5173` (development) or deployed URL

---

## Recommended Flow for Future Use

```
1. Clone from GitHub:
   git clone https://github.com/udaybhai109/PillPal_final.git
   cd PillPal_final

2. Install dependencies:
   npm install

3. Choose deployment method:
   
   A) Web Version (Simplest):
      npm run build
      → Deploy to Vercel/Netlify
      → Share link
   
   B) Native Android (Capacitor):
      npx cap init
      npm run build
      npx cap add android
      npx cap sync
      → Open in Android Studio at android/ folder
      → Build APK from Android Studio
   
   C) Local Testing:
      npm run dev
      → Access on device via: http://laptop-ip:5173
```

---

## Current GitHub Setup ✅

Your repository includes:
- ✅ All source code (React/TypeScript)
- ✅ Build scripts
- ✅ Testing setup
- ✅ CI/CD workflow
- ✅ Environment configuration
- ✅ Documentation

**GitHub Link:** https://github.com/udaybhai109/PillPal_final

---

## Next Steps

1. **Choose deployment option** from above
2. **For native Android:** Use Capacitor workflow
3. **For web:** Deploy to Vercel (free tier available)
4. **Set VITE_GEMINI_API_KEY** in environment

Would you like me to help with any of these options?
