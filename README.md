# Connecta - React Native Frontend

Connecta is a real-time communication app that supports secure authentication, persistent messaging, and high-quality video calling using WebRTC and FastAPI.

## ✨ Features

- **Secure Authentication**: Built-in login and registration system with JWT session management.
- **Real-Time Social Network**: 
    - View online users.
    - Send and accept friend requests.
- **Persistent Messaging**: Chat with your friends with message history.
- **High-Performance Video Calling**: Peer-to-peer video calls powered by WebRTC with automatic NAT traversal via STUN servers.
- **Modern UI**: A premium, responsive interface featuring interactive micro-animations and a sleek design.

## 📸 Screenshots

| Login / Register | People / Friends | Video Calling |
|:---:|:---:|:---:|
| ![Login Screen](file:///e:/Learning/connecta/fastapi-react-native/frontend/WhatsApp%20Image%202026-03-27%20at%2016.46.05%20(1).jpeg) | ![Friends List](file:///e:/Learning/connecta/fastapi-react-native/frontend/WhatsApp%20Image%202026-03-27%20at%2016.46.05.jpeg) | ![Video Call](file:///e:/Learning/connecta/fastapi-react-native/frontend/WhatsApp%20Image%202026-03-27%20at%2016.46.36.jpeg) |

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Android Studio](https://developer.android.com/studio) configured with SDK and Emulator (or a physical device)
- [FastAPI Backend](file:///e:/Learning/connecta/fastapi-react-native/backend) running on a accessible server/local network

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. Start the Metro Bundler:
   ```bash
   npm start
   ```
2. In a new terminal, run the app on Android:
   ```bash
   npx react-native run-android
   ```

## 🛠️ Configuration
Make sure the `BASE_URL` in `config.ts` points to your backend instance:
```typescript
const BASE_URL = 'https://your-backend-url.up.railway.app';
```

## 📜 Key Technologies
- **React Native**: Cross-platform mobile framework.
- **WebRTC**: Real-time peer-to-peer communication.
- **FastAPI**: (Backend) High-performance signaling and API server.
- **Socket.io/WebSocket**: Real-time signaling and messaging transport.
