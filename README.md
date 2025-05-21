# Farmer Government Aided Schemes

## Project Overview
This is a simple web application designed to help farmers access government-aided schemes and crop information. The system allows users to register and login as either Admin or User. Admins can post crop details, post government schemes, and approve or reject farmer scheme requests. Users can view crop details, view government schemes, apply for schemes, and track their application status.

The project uses HTML, CSS, JavaScript, and Firebase for authentication, database, and logging.

## Features
- User registration and login with Firebase Authentication
- Role-based access: Admin and User dashboards
- Admin functionalities:
  - Post crop details
  - Post government schemes
  - Approve or reject farmer scheme requests
- User functionalities:
  - View crop details
  - View government schemes
  - Apply for government schemes
  - View application status
- Logging of all actions to Firebase Firestore
- Simple and accessible UI

## Technologies Used
- HTML, CSS, JavaScript
- Firebase (Authentication, Firestore)

## Setup Instructions
1. Clone the repository.
2. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
3. Enable Email/Password Authentication in Firebase Authentication.
4. Create Firestore database in test mode.
5. Replace the Firebase configuration in `js/auth.js` with your Firebase project credentials.
6. Open `index.html` in a browser to start using the app.

## Usage
- Register as Admin or User.
- Admin can manage crops, schemes, and approve requests.
- User can view information and apply for schemes.
- All actions are logged for auditing.

## Notes
- This is a simple demo project for educational purposes.
- Ensure Firebase rules are configured appropriately for production use.

## License
This project is open source and available on GitHub.
