# SnapEdit - Professional Photo & Video Editor

A professional-grade photo and video editing application built with React Native, featuring advanced editing tools, stunning animations, and complete offline functionality.

## 🎯 Features

### Core Features
- **Gesture-First Interface**: Intuitive gesture controls throughout the app
- **Professional Editing Tools**: Filters, adjustments, curves, HSL, drawing, text, and more
- **Offline Operation**: Fully functional without internet connection
- **Premium Quality**: iOS-first design following Apple Human Interface Guidelines
- **Smooth Animations**: 60fps animations powered by Reanimated 3 and Skia

### Editing Capabilities
- ✅ **Filters**: 8 free + 8 premium professional filters
- ✅ **Adjustments**: Brightness, contrast, saturation, exposure, and more
- ✅ **Curves** (Premium): RGB curve adjustments for precise control
- ✅ **HSL** (Premium): Hue, saturation, and luminance per color range
- ✅ **Crop & Rotate**: Multiple aspect ratios with gesture controls
- ✅ **Drawing Tools**: Multiple brush types with layers support
- ✅ **Text Tools**: Rich text formatting with custom fonts
- ✅ **Video Editing**: Timeline-based editing with filters and adjustments

### Premium Features
- Remove watermark
- Advanced filters (Cinematic, Golden Hour, Arctic, etc.)
- Professional tools (Curves, HSL, Healing, Retouch)
- Unlimited layers
- 4K video export
- Cloud backup to iCloud

## 🏗️ Technology Stack

### Core Technologies
- **React Native 0.73+**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Native Reanimated 3**: High-performance animations
- **React Native Skia**: Advanced graphics rendering
- **Zustand**: Lightweight state management
- **MMKV**: High-performance local storage

### Key Libraries
- `@shopify/react-native-skia` - Graphics and effects
- `react-native-reanimated` - Smooth 60fps animations
- `react-native-gesture-handler` - Gesture recognition
- `react-navigation` - Navigation system
- `react-native-mmkv` - Fast key-value storage
- `react-native-fast-image` - Optimized image rendering
- `react-native-vector-icons` - Icon library (Ionicons)
- `react-native-linear-gradient` - Gradient effects
- `ffmpeg-kit-react-native` - Video processing
- `react-native-iap` - In-app purchases

## 📁 Project Structure

\`\`\`
src/
├── screens/              # Screen components
│   ├── SplashScreen/     # Animated splash with particles
│   ├── OnboardingScreen/ # 3-screen onboarding flow
│   ├── HomeScreen/       # Main dashboard
│   ├── GalleryScreen/    # Photo grid and albums
│   ├── EditorScreen/     # Photo/video editor
│   ├── SettingsScreen/   # App settings
│   └── PaywallScreen/    # Premium subscription
├── components/
│   ├── common/          # Reusable UI components
│   ├── editor/          # Editor-specific components
│   ├── animations/      # Animated components
│   └── gestures/        # Gesture handlers
├── navigation/          # Navigation configuration
├── store/              # Zustand state management
│   ├── userSlice.ts
│   ├── settingsSlice.ts
│   ├── editorSlice.ts
│   ├── gallerySlice.ts
│   └── subscriptionSlice.ts
├── services/           # Business logic services
│   ├── storage/        # MMKV storage service
│   ├── fileSystem/     # File operations
│   ├── imageProcessing/
│   ├── videoProcessing/
│   └── iap/
├── theme/             # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── borderRadius.ts
│   └── shadows.ts
├── constants/         # App constants
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
└── assets/           # Images, fonts, videos
\`\`\`

## 🎨 Design System

### Color Palette
- **Obsidian Black**: `#0A0A0A` (main background)
- **Carbon Gray**: `#1C1C1E` (secondary)
- **Electric Blue**: `#0A84FF` (primary actions)
- **Vivid Purple**: `#8E44E8` (premium features)
- **Emerald Green**: `#34C759` (success)
- **Coral Red**: `#FF453A` (destructive)

### Typography
- Primary font: SF Pro Display (iOS native)
- Scale: Hero (48px), H1 (34px), H2 (28px), H3 (22px), Body (15-17px)
- All text follows iOS Dynamic Type guidelines

### Spacing
- Base unit: 4px
- Scale: xs(4), sm(8), md(16), lg(24), xl(32), xxl(48), xxxl(64)

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment set up
- iOS: Xcode 14+ with iOS 15+ SDK
- Android: Android Studio with Android SDK 31+

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd SnapEdit---Professional-Photo-Video-Editor
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Install iOS pods** (macOS only)
\`\`\`bash
cd ios && pod install && cd ..
# or
npm run pod-install
\`\`\`

4. **Start Metro bundler**
\`\`\`bash
npm start
# or
yarn start
\`\`\`

5. **Run on iOS**
\`\`\`bash
npm run ios
# or
yarn ios
\`\`\`

6. **Run on Android**
\`\`\`bash
npm run android
# or
yarn android
\`\`\`

## 📱 App Screens

### 1. Splash Screen
- Animated logo with particle effects
- Loads persisted user data
- Auto-navigates to onboarding or home

### 2. Onboarding (First Launch)
- 3 screens with immersive visuals
- Swipe to navigate or skip
- Feature highlights and call-to-action

### 3. Home Screen
- Welcome message with user greeting
- Quick action cards (Camera, Gallery, Video)
- Recent edits grid
- Browse all photos button

### 4. Gallery Screen
- Photo grid with infinite scroll
- Album organization
- Selection mode with multi-select
- Sort and filter options
- FAB for quick actions

### 5. Editor Screen
- Canvas with gesture controls
- 8 tool categories (Filters, Adjust, Curves, HSL, Crop, Drawing, Text, Details)
- Real-time preview
- Undo/redo history
- Export with quality options

### 6. Settings Screen
- User profile
- App preferences
- Export settings
- Storage management
- Premium subscription management

### 7. Paywall Screen
- Premium feature showcase
- Subscription plans (Monthly, Yearly, Lifetime)
- Pricing display
- Restore purchase option

## 🔐 State Management

The app uses Zustand for state management with the following slices:

- **User Slice**: Authentication and profile
- **Settings Slice**: App preferences
- **Editor Slice**: Editing state and history
- **Gallery Slice**: Photos, selection, sorting
- **Subscription Slice**: Premium status

All state is persisted to MMKV storage for fast access and offline support.

## 💾 Data Storage

### MMKV (Key-Value)
- User settings and preferences
- Subscription status
- Onboarding completion flag

### File System
- Original images and videos
- Edited exports
- Project files (.snapedit)
- Cache (thumbnails, filter previews)

### SQLite (Future)
- Editing history metadata
- Project database

## 🎬 Animations

All animations use React Native Reanimated 3 for 60fps performance:

- **Spring animations**: Natural, physics-based motion
- **Timing animations**: Precise duration control
- **Gesture animations**: Interactive drag, pinch, rotate
- **Shared element transitions**: Smooth screen transitions
- **Skia animations**: Particle effects, complex graphics

## 📊 Performance

### Optimization Strategies
- **Image optimization**: Progressive loading, caching, thumbnail generation
- **List virtualization**: FlatList with windowSize optimization
- **Reanimated worklets**: UI thread animations
- **Skia rendering**: Hardware-accelerated graphics
- **Lazy loading**: Components loaded on demand
- **Memory management**: Aggressive cleanup of unused resources

### Target Metrics
- App launch time: < 2 seconds
- 60fps animations throughout
- Max memory usage: < 500MB
- Thumbnail cache: < 100MB

## 🔒 Premium Features

### In-App Purchase Products
- **Monthly**: $9.99/month (7-day free trial)
- **Yearly**: $49.99/year (best value, save 58%)
- **Lifetime**: $99.99 one-time purchase

### Premium Benefits
- All premium filters (8 additional)
- Advanced tools (Curves, HSL, Healing)
- Unlimited text and drawing layers
- Remove watermark
- 4K video export
- Cloud backup to iCloud

## 🧪 Testing

### Unit Tests
\`\`\`bash
npm test
\`\`\`

### E2E Tests (Future)
- Detox for iOS/Android
- Test navigation flows
- Test editing operations

## 📖 Documentation

- **SDD.md**: Complete Software Design Document
- **README.md**: This file
- **API docs**: (Future) Auto-generated from TSDoc comments

## 🛠️ Development

### Code Style
- ESLint configuration included
- Prettier for code formatting
- TypeScript strict mode enabled

### Git Workflow
- Feature branches from main
- Conventional commits
- PR reviews before merge

### Scripts
\`\`\`bash
npm start          # Start Metro bundler
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run lint       # Run ESLint
npm test           # Run tests
npm run pod-install # Install iOS CocoaPods
\`\`\`

## 🐛 Known Issues

- None reported yet (initial release)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Project setup
- ✅ Design system
- ✅ Navigation
- ✅ State management
- ✅ Splash screen
- ✅ Home screen
- 🔄 Gallery screen (in progress)
- ⏳ Editor screen
- ⏳ All editing tools

### Phase 2 (Future)
- AI-powered tools (object removal, background replacement)
- Collaborative editing
- Preset packs and templates
- Advanced video features
- Community gallery

### Phase 3 (Future)
- Android optimization
- iPad support with Apple Pencil
- macOS/Windows desktop app

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a proprietary project. External contributions are not currently accepted.

## 📧 Support

For support, contact: support@snapedit.app

## 🙏 Acknowledgments

- React Native community
- Shopify for React Native Skia
- Software Mansion for Reanimated
- Unsplash & Pixabay for placeholder assets

---

**Version**: 1.0.0
**Build**: 1
**Last Updated**: 2024

🤖 Generated with [Claude Code](https://claude.com/claude-code)
