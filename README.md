# Habit Tracker - React Native Mobile App

A social habit tracking application built with React Native (Expo) and Django backend.

This is the frontend part of the Habit Tracker project.

## Features
- Social habit tracking
- Photo verification system
- Achievement and reward system
- Avatar customization
- Friend system for habit verification

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device

## Setup

**Important:** This frontend requires the backend server to be running. Please set up the backend first by following the instructions in the backend repository's README:

[Habit Tracker Backend Repository](https://github.com/isobed18/habitchatB)

Once the backend is set up and running, proceed with the frontend setup:

1. Clone this repository:
```bash
git clone https://github.com/isobed18/habitchatF.git
cd habit_f
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL:
Create a `.env` file in the root directory with your backend API URL:
```
API_URL=http://YOUR_IP_ADDRESS:8000/api/
```

To find your IP address:
- Windows: 
  1. Open Command Prompt
  2. Type `ipconfig`
  3. Look for "Wireless LAN adapter Wi-Fi: IPv4 Address"
- Mac/Linux:
  1. Open Terminal
  2. Type `ifconfig`
  3. Look for "inet" under your WiFi interface

4. Start the development server:
```bash
npx expo start
```

5. Run on your device:
- Install Expo Go on your mobile device
- Scan the QR code that appears in the terminal or browser
- The app will load on your device

## Important Notes
- Make sure your backend server is running before starting the frontend
- The frontend and backend must be on the same network
- If you change your IP address, update the API_URL in .env file
- For development, both frontend and backend should be running simultaneously
- Never commit your .env file to git (it's already in .gitignore)
- If you get API connection errors, check if:
  1. Your IP address is correct in .env
  2. Backend server is running
  3. You're on the same network as the backend server

## Available Scripts
- `npx expo start` - Starts the Expo development server
- `npx expo start --android` - Runs the app on Android
- `npx expo start --ios` - Runs the app on iOS
- `npx expo start --web` - Runs the app in web browser

## Project Structure
- `/assets` - Images and other static assets
- `/HomeModals` - Modal components for the Home screen
- `/services` - API and other services
- `/utils` - Utility functions

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 