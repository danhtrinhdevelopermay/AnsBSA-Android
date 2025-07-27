# Vietnamese AI Chat - Android App

Ứng dụng Android cho Vietnamese AI Chat với đầy đủ tính năng như bản web.

## 🚀 Tính năng

### 🤖 AI Chat
- Chat thông minh với AI Gemini
- Hỗ trợ tiếng Việt tối ưu
- Gửi hình ảnh và tài liệu
- Lưu trữ lịch sử chat

### 🎨 Tạo nội dung AI
- **Tạo hình ảnh**: Từ mô tả tiếng Việt
- **Tạo video**: AI tạo video từ văn bản
- **Phân tích tài liệu**: Upload và phân tích PDF, DOC

### 💻 Web Builder
- Code editor tích hợp
- Live preview
- Quản lý file project
- Hỗ trợ HTML, CSS, JavaScript

### 🔐 Xác thực & Bảo mật
- Firebase Authentication
- Hệ thống Credits
- Đồng bộ dữ liệu cloud

### 🎨 Giao diện
- Material Design 3
- Chế độ sáng/tối
- Responsive design
- Animations mượt mà

## 📱 Yêu cầu hệ thống

- **Android**: 5.0+ (API level 21+)
- **RAM**: Tối thiểu 2GB
- **Storage**: 100MB trống
- **Network**: Kết nối internet

## 🛠️ Cài đặt

### Từ GitHub Releases
1. Vào [Releases](https://github.com/yourrepo/releases)
2. Tải APK mới nhất
3. Bật "Cài đặt từ nguồn không xác định" trong Settings
4. Cài đặt APK

### Build từ source
```bash
# Clone repository
git clone https://github.com/yourrepo/vietnamese-ai-chat
cd vietnamese-ai-chat/android

# Install dependencies
npm install

# Build debug APK
cd android
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

## 🔧 Cấu hình

### Firebase Setup
1. Tạo project Firebase mới
2. Thêm Android app với package `com.vietnameseaichat`
3. Tải `google-services.json` vào `android/app/`
4. Enable Authentication và Firestore

### API Keys
Tạo file `.env` trong thư mục `android/`:
```env
GEMINI_API_KEY=your-gemini-api-key
FIREBASE_API_KEY=your-firebase-api-key
```

### Signing APK
Để build release APK, tạo keystore:
```bash
keytool -genkey -v -keystore upload-keystore.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

Tạo file `android/gradle.properties`:
```
MYAPP_UPLOAD_STORE_FILE=upload-keystore.keystore
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=your-password
MYAPP_UPLOAD_KEY_PASSWORD=your-password
```

## 🚀 GitHub Actions CI/CD

Workflow tự động build APK khi push code:

### Required Secrets
Trong GitHub repository settings > Secrets:

```
ANDROID_KEYSTORE=<base64-encoded-keystore-file>
ANDROID_KEY_ALIAS=upload
ANDROID_STORE_PASSWORD=your-store-password
ANDROID_KEY_PASSWORD=your-key-password
GOOGLE_SERVICES_JSON=<content-of-google-services.json>
```

### Workflow Features
- ✅ Tự động build Debug & Release APK
- ✅ Upload artifacts
- ✅ Tạo GitHub Release khi push lên main
- ✅ Cache dependencies để build nhanh hơn
- ✅ Multi-architecture support

## 📁 Cấu trúc Project

```
android/
├── src/
│   ├── components/          # UI components
│   ├── context/            # React contexts
│   ├── screens/            # App screens
│   ├── services/           # API services
│   └── utils/              # Utilities
├── android/                # Native Android code
│   ├── app/
│   │   ├── src/main/java/
│   │   └── build.gradle
│   └── build.gradle
├── .github/workflows/      # GitHub Actions
├── package.json
└── README.md
```

## 🎯 Các màn hình chính

### 1. Authentication
- **LoginScreen**: Đăng nhập
- **RegisterScreen**: Đăng ký tài khoản

### 2. Main App
- **ChatScreen**: Giao diện chat chính
- **WebBuilderScreen**: Code editor và preview
- **ProfileScreen**: Thông tin người dùng
- **SettingsScreen**: Cài đặt ứng dụng

### 3. Components
- **MessageBubble**: Hiển thị tin nhắn
- **CodeEditor**: Editor code với syntax highlighting
- **FileManager**: Quản lý file project
- **DrawerContent**: Navigation drawer

## 🔄 API Integration

### Backend Communication
```typescript
// Kết nối với backend server
const API_BASE_URL = 'https://your-backend.repl.co';

// Chat API
POST /api/chat
GET /api/chats/{id}/messages

// File API
POST /api/web-builder/files
GET /api/web-builder/files
```

### Features Cost (Credits)
- **Chat cơ bản**: 50 credits
- **Tạo hình ảnh**: 200 credits  
- **Tạo video**: 300 credits
- **Phân tích tài liệu**: 200 credits

## 🔧 Development

### Prerequisites
- Node.js 18+
- Java JDK 17
- Android SDK 34
- React Native CLI

### Running in Development
```bash
# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android

# Run on iOS (if available)
npm run ios
```

### Debugging
- **Chrome DevTools**: Inspect elements và debug JS
- **Flipper**: Debug React Native app
- **Logcat**: View Android native logs

## 📝 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📞 Support

- **Email**: support@vietnameseaichat.com
- **GitHub Issues**: [Create Issue](https://github.com/yourrepo/issues)
- **Documentation**: [Wiki](https://github.com/yourrepo/wiki)

---

**Made with ❤️ for Vietnamese AI Community**