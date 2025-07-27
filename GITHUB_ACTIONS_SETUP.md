# 🚀 GitHub Actions APK Build Setup

## Hướng dẫn thiết lập GitHub Actions để build APK tự động

### 1. 🔐 Cấu hình GitHub Secrets

Truy cập **Settings > Secrets and variables > Actions** trong repository GitHub và thêm các secrets sau:

#### Firebase Configuration:
```
GOOGLE_SERVICES_JSON
```
- **Value**: Nội dung file `google-services.json` từ Firebase Console
- **Cách lấy**: 
  1. Vào Firebase Console > Project Settings
  2. Chọn Android app 
  3. Download `google-services.json`
  4. Copy toàn bộ nội dung file và paste vào secret này

#### Android Signing Configuration:
```
ANDROID_KEYSTORE
ANDROID_KEY_ALIAS
ANDROID_STORE_PASSWORD
ANDROID_KEY_PASSWORD
```

**Cách tạo keystore:**
```bash
keytool -genkey -v -keystore upload-keystore.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

**Encode keystore to base64:**
```bash
base64 upload-keystore.keystore > keystore.base64
```

**Secrets configuration:**
- `ANDROID_KEYSTORE`: Nội dung file `keystore.base64`
- `ANDROID_KEY_ALIAS`: `upload` (hoặc alias bạn đã chọn)
- `ANDROID_STORE_PASSWORD`: Password bạn đã nhập khi tạo keystore
- `ANDROID_KEY_PASSWORD`: Password cho key (thường giống store password)

### 2. 📁 Cấu trúc project cần thiết

```
android/
├── .github/workflows/android-build.yml  ✅ (Đã có)
├── android/
│   ├── app/
│   │   ├── build.gradle                  ✅ (Đã có)
│   │   ├── proguard-rules.pro           ✅ (Đã có)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml      ✅ (Đã có)
│   │       ├── java/                    ✅ (Đã có)
│   │       └── res/                     ✅ (Đã có)
│   ├── build.gradle                     ✅ (Đã có)
│   ├── settings.gradle                  ✅ (Đã có)
│   ├── gradle.properties               ✅ (Đã có)
│   ├── gradlew                         ✅ (Đã có)
│   └── gradle/wrapper/                 ✅ (Đã có)
├── package.json                        ✅ (Đã có)
├── package-lock.json                   ✅ (Đã có)
└── index.js                           ✅ (Đã có)
```

### 3. 🔧 Workflow Features

GitHub Actions workflow sẽ tự động:

- ✅ **Setup Environment**: Node.js 18, Java 17, Android SDK
- ✅ **Cache Dependencies**: Gradle và npm packages
- ✅ **Install Dependencies**: Tự động cài đặt tất cả packages
- ✅ **Create Config Files**: Firebase config và keystore từ secrets
- ✅ **Build APK**: Debug và Release versions
- ✅ **Upload Artifacts**: APK files có thể download
- ✅ **Create GitHub Release**: Tự động khi push lên main branch
- ✅ **Multi-Architecture**: Support arm64-v8a, armeabi-v7a, x86, x86_64

### 4. 🎯 Triggers

Workflow sẽ chạy khi:
- **Push** lên branch `main` hoặc `develop`
- **Pull Request** vào branch `main`
- **Manual trigger** qua GitHub UI

### 5. 📱 APK Output

Sau khi build thành công:
- **Debug APK**: `app-debug.apk` (Development testing)
- **Release APK**: `app-release.apk` (Production ready)
- **GitHub Release**: Tự động tạo release với APK đính kèm

### 6. 🔍 Troubleshooting

#### Build fails với "google-services.json not found":
- Kiểm tra secret `GOOGLE_SERVICES_JSON` có đúng định dạng JSON
- Đảm bảo package name trong Firebase match với `com.vietnameseaichat`

#### Signing errors:
- Verify keystore được encode đúng base64
- Check password secrets có chính xác
- Đảm bảo key alias đúng

#### Gradle build errors:
- Check Java/Android SDK versions trong workflow
- Verify dependencies trong `build.gradle` 
- Ensure `gradle-wrapper.properties` có đúng Gradle version

### 7. 📊 Build Status

Monitor build progress tại:
- **Actions Tab**: `https://github.com/your-username/your-repo/actions`
- **Build Logs**: Click vào workflow run để xem chi tiết
- **Download APK**: Vào Artifacts section sau khi build xong

### 8. 🚀 Next Steps

Sau khi setup xong:
1. Push code lên GitHub
2. Kiểm tra workflow chạy thành công
3. Download APK từ Artifacts hoặc Releases
4. Test ứng dụng trên thiết bị Android
5. Deploy lên Google Play Store (optional)

---

**🎉 Repository GitHub**: https://github.com/danhtrinhdevelopermay/AnsBSA-Android.git

**📱 App Features Ready**:
- AI Chat với Gemini API
- Firebase Authentication
- AI Image & Video Generation  
- Web Builder với Code Editor
- Material Design 3 UI
- Light/Dark Theme
- Credit Management System