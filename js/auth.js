// Firebase configuration - replace with your own Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const authSection = document.getElementById('auth-section');
const registerSection = document.getElementById('register-section');
const messageDiv = document.getElementById('message');

// Show register form
if (showRegisterBtn) {
  showRegisterBtn.addEventListener('click', () => {
    authSection.style.display = 'none';
    registerSection.style.display = 'block';
    messageDiv.textContent = '';
  });
}

// Show login form
if (showLoginBtn) {
  showLoginBtn.addEventListener('click', () => {
    registerSection.style.display = 'none';
    authSection.style.display = 'block';
    messageDiv.textContent = '';
  });
}

// Register
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const role = document.getElementById('register-role').value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Save user role in Firestore
        return db.collection('users').doc(user.uid).set({
          email: email,
          role: role
        });
      })
      .then(() => {
        messageDiv.textContent = 'Registration successful. You can now login.';
        registerForm.reset();
        registerSection.style.display = 'none';
        authSection.style.display = 'block';
      })
      .catch((error) => {
        messageDiv.textContent = error.message;
      });
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Get user role and redirect accordingly
        db.collection('users').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              const role = doc.data().role;
              if (role === 'admin') {
                window.location.href = 'admin.html';
              } else {
                window.location.href = 'user.html';
              }
            } else {
              messageDiv.textContent = 'User role not found.';
            }
          });
      })
      .catch((error) => {
        messageDiv.textContent = error.message;
      });
  });
}
