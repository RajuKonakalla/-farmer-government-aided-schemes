// User functionalities: view crop details, view govt schemes, apply for schemes, view application status

const db = firebase.firestore();
const auth = firebase.auth();

const cropList = document.getElementById('crop-list');
const schemeList = document.getElementById('scheme-list');
const schemeSelect = document.getElementById('scheme-select');
const applySchemeForm = document.getElementById('apply-scheme-form');
const applicationStatusList = document.getElementById('application-status-list');
const logoutBtn = document.getElementById('logout-btn');

import { logAction } from './logger.js';

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
});

// Load crop details
function loadCrops() {
  db.collection('crops').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    cropList.innerHTML = '';
    if (snapshot.empty) {
      cropList.innerHTML = '<p>No crop details available.</p>';
      return;
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement('div');
      div.classList.add('crop-item');
      div.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.details}</p>
      `;
      cropList.appendChild(div);
    });
  });
}

// Load government schemes
function loadSchemes() {
  db.collection('schemes').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    schemeList.innerHTML = '';
    schemeSelect.innerHTML = '<option value="" disabled selected>Select Scheme</option>';
    if (snapshot.empty) {
      schemeList.innerHTML = '<p>No government schemes available.</p>';
      return;
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement('div');
      div.classList.add('scheme-item');
      div.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.details}</p>
      `;
      schemeList.appendChild(div);

      // Add to scheme select dropdown
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = data.name;
      schemeSelect.appendChild(option);
    });
  });
}

// Apply for a government scheme
applySchemeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const schemeId = schemeSelect.value;
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  if (!schemeId || !userId) {
    alert('Please select a scheme and ensure you are logged in.');
    return;
  }
  db.collection('applications').add({
    userId: userId,
    schemeId: schemeId,
    status: 'pending',
    appliedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Application submitted successfully.');
    applySchemeForm.reset();
    logAction(userId, 'apply_scheme', { schemeId });
  }).catch((error) => {
    alert('Error submitting application: ' + error.message);
  });
});

// Load application status
function loadApplicationStatus() {
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  if (!userId) {
    applicationStatusList.innerHTML = '<p>Please login to view application status.</p>';
    return;
  }
  db.collection('applications').where('userId', '==', userId).onSnapshot((snapshot) => {
    applicationStatusList.innerHTML = '';
    if (snapshot.empty) {
      applicationStatusList.innerHTML = '<p>No applications found.</p>';
      return;
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement('div');
      div.classList.add('application-item');
      div.innerHTML = `
        <p><strong>Scheme ID:</strong> ${data.schemeId}</p>
        <p><strong>Status:</strong> ${data.status}</p>
      `;
      applicationStatusList.appendChild(div);
    });
  });
}

// Initialize
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    loadCrops();
    loadSchemes();
    loadApplicationStatus();
  }
});
