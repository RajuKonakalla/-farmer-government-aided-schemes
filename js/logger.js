// Logger module to log actions to Firestore and console

const db = firebase.firestore();

function logAction(userId, action, details = {}) {
  const logEntry = {
    userId: userId || 'unknown',
    action: action,
    details: details,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  // Save log to Firestore collection 'logs'
  db.collection('logs').add(logEntry)
    .then(() => {
      console.log('Action logged:', logEntry);
    })
    .catch((error) => {
      console.error('Error logging action:', error);
    });
}

export { logAction };
