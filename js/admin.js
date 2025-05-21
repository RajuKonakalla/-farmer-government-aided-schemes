// Admin functionalities: post crop details, post govt schemes, approve farmer scheme requests

const db = firebase.firestore();
const auth = firebase.auth();

const cropForm = document.getElementById('crop-form');
const schemeForm = document.getElementById('scheme-form');
const requestsList = document.getElementById('requests-list');
const logoutBtn = document.getElementById('logout-btn');

import { logAction } from './logger.js';

// Logout
logoutBtn.addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
});

// Post Crop Details
cropForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cropName = document.getElementById('crop-name').value;
  const cropDetails = document.getElementById('crop-details').value;

  db.collection('crops').add({
    name: cropName,
    details: cropDetails,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Crop details posted successfully.');
    cropForm.reset();
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    logAction(userId, 'post_crop', { cropName });
  }).catch((error) => {
    alert('Error posting crop details: ' + error.message);
  });
});

// Post Government Scheme
schemeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const schemeName = document.getElementById('scheme-name').value;
  const schemeDetails = document.getElementById('scheme-details').value;

  db.collection('schemes').add({
    name: schemeName,
    details: schemeDetails,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert('Government scheme posted successfully.');
    schemeForm.reset();
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    logAction(userId, 'post_scheme', { schemeName });
  }).catch((error) => {
    alert('Error posting scheme: ' + error.message);
  });
});

// Load and display farmer scheme requests for approval
function loadRequests() {
  db.collection('applications').where('status', '==', 'pending').onSnapshot((snapshot) => {
    requestsList.innerHTML = '';
    if (snapshot.empty) {
      requestsList.innerHTML = '<p>No pending requests.</p>';
      return;
    }
    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement('div');
      div.classList.add('request-item');
      div.innerHTML = `
        <p><strong>User ID:</strong> ${data.userId}</p>
        <p><strong>Scheme ID:</strong> ${data.schemeId}</p>
        <button data-id="${doc.id}" class="approve-btn">Approve</button>
        <button data-id="${doc.id}" class="reject-btn">Reject</button>
      `;
      requestsList.appendChild(div);
    });

    // Add event listeners for approve/reject buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateRequestStatus(id, 'approved');
      });
    });
    document.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateRequestStatus(id, 'rejected');
      });
    });
  });
}

function updateRequestStatus(id, status) {
  db.collection('applications').doc(id).update({
    status: status,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert(`Request ${status}.`);
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    logAction(userId, `request_${status}`, { requestId: id });
  }).catch((error) => {
    alert('Error updating request status: ' + error.message);
  });
}

// Initialize
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'index.html';
  } else {
    loadRequests();
  }
});
