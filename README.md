# Bridge App

A React Native mobile application built with Expo that connects job seekers with employment opportunities. Bridge App provides a comprehensive job search and application platform with user authentication, profile management, and job filtering capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login and signup with Firebase Authentication
- **Job Search**: Browse and search through job listings with advanced filtering
- **Profile Management**: Create and edit detailed user profiles with photo upload
- **Job Applications**: Save and manage job applications
- **Dashboard**: Personalized dashboard with quick access to key features
- **Activity Tracking**: Monitor your job search activity and applications

### Advanced Features
- **Smart Filtering**: Filter jobs by location, job type, work mode, and categories
- **Search Functionality**: Search jobs and companies with real-time results
- **Document Management**: Upload and manage resumes and other documents
- **Responsive Design**: Optimized for both iOS and Android platforms
- **Dark/Light Theme**: Customizable theme support
- **Offline Support**: Basic offline functionality with local storage

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Navigation**: React Navigation
- **State Management**: React Context API
- **UI Components**: Custom components with React Native
- **Image Handling**: Expo Image Picker and Image Manipulator
- **Storage**: AsyncStorage for local data persistence

## 📱 Screenshots

The app includes the following main screens:
- **Starter**: Welcome and onboarding
- **Login/SignUp**: User authentication
- **Dashboard**: Main hub with quick actions
- **JobList**: Browse and filter job listings
- **JobDescription**: Detailed job information
- **Profile**: User profile management
- **Activity**: Track job search activity
- **Templates**: Application templates
- **Settings**: User preferences and settings

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Bridge02
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Create a `.env` file in the root directory with your Firebase configuration:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## 📁 Project Structure

```
Bridge02/
├── android/                 # Android-specific configuration
├── assets/                  # Images, icons, and static assets
├── components/              # Reusable React components
│   ├── profile-edit/       # Profile editing components
│   ├── read-only-info/     # Legal and policy components
│   └── ...
├── context/                # React Context providers
├── data/                   # Static data files
├── hooks/                  # Custom React hooks
├── screens/                # Main application screens
├── services/               # API and service functions
├── scripts/                # Utility scripts
├── App.js                  # Main application component
├── app.json               # Expo configuration
├── firebase.js            # Firebase configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## 🔐 Environment Variables

Make sure to set up the following environment variables in your `.env` file:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`

## 📱 Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Paloma Rojas**
- Email: [paloma.rkhn@gmail.com]

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- Firebase for backend services
- React Native community for excellent documentation and support

---

**Note**: This is a mobile application designed for job seekers to find and apply for employment opportunities. The app provides a modern, user-friendly interface for managing job searches and applications.
