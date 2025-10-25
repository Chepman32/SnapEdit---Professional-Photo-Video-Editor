# Production Build Guide

## Prerequisites

- Node.js 18+
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS dependencies)

## Environment Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Configure environment variables for production in `.env`:
```
NODE_ENV=production
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
```

## iOS Production Build

### 1. Install Dependencies

```bash
# Install Node modules
npm install

# Install iOS pods
cd ios && pod install && cd ..
```

### 2. Configure Signing

1. Open `ios/SnapEdit.xcworkspace` in Xcode
2. Select the project in Navigator
3. Under "Signing & Capabilities":
   - Select your Team
   - Ensure automatic signing is enabled
   - Verify Bundle Identifier matches App Store Connect

### 3. Build Configuration

```bash
# Build for release
npx react-native run-ios --configuration Release
```

### 4. Archive for App Store

1. In Xcode: Product → Archive
2. Once archived, select "Distribute App"
3. Choose "App Store Connect"
4. Follow the wizard to upload

### 5. TestFlight

- After upload, build will process in App Store Connect
- Add testers in TestFlight section
- Submit for review when ready

## Android Production Build

### 1. Generate Signing Key

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore snapedit-release.keystore -alias snapedit-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Gradle

Create `android/gradle.properties` (if not exists) and add:

```properties
MYAPP_RELEASE_STORE_FILE=snapedit-release.keystore
MYAPP_RELEASE_KEY_ALIAS=snapedit-key-alias
MYAPP_RELEASE_STORE_PASSWORD=***your_store_password***
MYAPP_RELEASE_KEY_PASSWORD=***your_key_password***
```

### 3. Build APK/AAB

```bash
# Clean build
cd android && ./gradlew clean && cd ..

# Build APK (for testing)
cd android && ./gradlew assembleRelease && cd ..

# Build AAB (for Play Store)
cd android && ./gradlew bundleRelease && cd ..
```

### 4. Output Locations

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### 5. Upload to Play Store

1. Go to Google Play Console
2. Select your app
3. Navigate to "Production" → "Create new release"
4. Upload AAB file
5. Fill in release details and submit for review

## Build Optimization

### 1. Enable Hermes (Recommended)

In `android/app/build.gradle`:
```gradle
project.ext.react = [
    enableHermes: true
]
```

In `ios/Podfile`:
```ruby
:hermes_enabled => true
```

### 2. Proguard Configuration (Android)

Ensure ProGuard is enabled in `android/app/build.gradle`:
```gradle
def enableProguardInReleaseBuilds = true
```

### 3. Code Shrinking

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

## Performance Optimization

### 1. Bundle Size Optimization

```bash
# Analyze bundle
npx react-native-bundle-visualizer
```

### 2. Image Optimization

- Use WebP format where possible
- Implement lazy loading for images
- Use appropriate image sizes (2x, 3x for iOS)

### 3. Enable Inline Requires

In `metro.config.js`:
```javascript
transformer: {
  inlineRequires: true,
}
```

## Testing Production Build

### iOS

```bash
# Test on simulator with release configuration
npx react-native run-ios --configuration Release

# Test on device
# Connect device and select it in Xcode, then build
```

### Android

```bash
# Install release APK on connected device
cd android && ./gradlew installRelease && cd ..
```

## Pre-Release Checklist

- [ ] All environment variables configured
- [ ] App icons and splash screens updated
- [ ] Privacy policy and terms of service URLs updated
- [ ] App Store/Play Store descriptions prepared
- [ ] Screenshots and preview videos created
- [ ] In-app purchase products configured
- [ ] Analytics and crash reporting tested
- [ ] All permissions properly requested with descriptions
- [ ] App tested on multiple devices/OS versions
- [ ] Performance profiled and optimized
- [ ] Security audit completed
- [ ] Accessibility features tested
- [ ] Localization completed (if applicable)

## Common Issues

### iOS

**Issue**: "Command PhaseScriptExecution failed"
**Solution**: Clean build folder (Cmd+Shift+K) and rebuild

**Issue**: Pod install fails
**Solution**:
```bash
cd ios
pod deintegrate
pod install
```

### Android

**Issue**: "Execution failed for task ':app:bundleReleaseJsAndAssets'"
**Solution**:
```bash
mkdir -p android/app/src/main/assets
```

**Issue**: Build fails with memory error
**Solution**: In `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

## Monitoring

### Crash Reporting

Integrate one of:
- Sentry
- Firebase Crashlytics
- Bugsnag

### Analytics

Integrate one of:
- Firebase Analytics
- Amplitude
- Mixpanel

### Performance Monitoring

- Firebase Performance Monitoring
- New Relic
- Datadog

## Version Management

Update version numbers:

**iOS**: `ios/SnapEdit/Info.plist`
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

**Android**: `android/app/build.gradle`
```gradle
versionCode 1
versionName "1.0.0"
```

## Release Process

1. **Code Freeze**: Stop new feature development
2. **Testing**: Complete QA testing
3. **Build**: Create production builds
4. **Internal Testing**: TestFlight/Internal Testing track
5. **Beta Testing**: External testers
6. **Submit**: Upload to stores
7. **Review**: Address store review feedback
8. **Release**: Publish to production
9. **Monitor**: Watch for crashes/issues
10. **Iterate**: Plan next release

## Support

For build issues:
- Check React Native documentation
- Review GitHub issues
- Contact development team

---

**Last Updated**: December 2024
**Version**: 1.0.0
