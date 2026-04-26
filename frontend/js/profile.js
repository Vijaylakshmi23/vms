// ===== PROFILE MANAGEMENT =====

function loadProfile() {
  if (appState.currentUser) {
    document.getElementById('profileName').value = appState.currentUser.name;
    document.getElementById('profileEmail').value = appState.currentUser.email;
    document.getElementById('profilePhone').value = appState.currentUser.phone || '';
    document.getElementById('profileRole').value = appState.currentRole.charAt(0).toUpperCase() + appState.currentRole.slice(1);
  }
}

function updateProfile(event) {
  event.preventDefault();
  
  const phone = document.getElementById('profilePhone').value;
  
  if (appState.currentUser) {
    appState.currentUser.phone = phone;
    localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
    showNotification('Profile updated successfully', 'success');
  }
}

function changePassword(event) {
  event.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (newPassword !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showNotification('Password must be at least 6 characters long', 'error');
    return;
  }
  
  showNotification('Password changed successfully', 'success');
  
  // Clear form
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
}

// Load profile when viewing profile page
document.addEventListener('navigateToProfile', function() {
  loadProfile();
});
