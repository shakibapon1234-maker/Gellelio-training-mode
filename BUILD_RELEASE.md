# Gellelio build commands

## Desktop

1. Install Node.js.
2. Run `npm install`.
3. Run `npm start` for the Electron desktop app.
4. Run `npm run build-win` to create the Windows installer and portable build in `dist/`.

## Android APK

1. Install Android Studio/SDK and set `ANDROID_HOME`.
2. Run `Build_APK.bat`.
3. The debug APK is copied to `Gellelio-Galileo-Training-debug.apk`.

The Android wrapper loads the same offline `index.html`, `css/`, and `js/` files as the desktop app. Before release, configure a signed release keystore and replace the debug build.
