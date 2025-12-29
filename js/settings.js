
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Initialize form submissions
  initializeFormSubmissions();
  
  // Initialize password toggles
  initializePasswordToggles();
  
  // Initialize preference toggles
  initializePreferenceToggles();
  
  // Initialize danger zone buttons
  initializeDangerZoneButtons();
});

// Form submissions
function initializeFormSubmissions() {
  // Profile form
  const profileForm = document.querySelector('.settings-section:nth-child(1) form');
  
  if (profileForm) {
    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form data
      const displayName = document.getElementById('displayName').value;
      const email = document.getElementById('email').value;
      const bio = document.getElementById('bio').value;
      
      // Validate data
      if (!displayName || !email) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      // In a real app, this would send data to a server
      console.log('Profile update:', { displayName, email, bio });
      
      // Show success message
      showToast('Profile updated successfully', 'success');
    });
  }
  
  // Password form
  const passwordForm = document.querySelector('.settings-section:nth-child(2) form');
  
  if (passwordForm) {
    passwordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form data
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      // Validate data
      if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Please fill in all password fields', 'error');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }
      
      if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
      }
      
      // In a real app, this would send data to a server
      console.log('Password update:', { currentPassword, newPassword });
      
      // Show success message
      showToast('Password updated successfully', 'success');
      
      // Clear form
      passwordForm.reset();
    });
  }
}

// Preference toggles
function initializePreferenceToggles() {
  // Email notifications toggle
  const emailNotificationsSwitch = document.getElementById('emailNotificationsSwitch');
  
  if (emailNotificationsSwitch) {
    // Check saved preference
    const savedPreference = localStorage.getItem('emailNotifications');
    if (savedPreference === 'disabled') {
      emailNotificationsSwitch.checked = false;
    }
    
    emailNotificationsSwitch.addEventListener('change', () => {
      if (emailNotificationsSwitch.checked) {
        localStorage.setItem('emailNotifications', 'enabled');
        showToast('Email notifications enabled', 'info');
      } else {
        localStorage.setItem('emailNotifications', 'disabled');
        showToast('Email notifications disabled', 'info');
      }
    });
  }
  
  // Message privacy toggle
  const messagePrivacySwitch = document.getElementById('messagePrivacySwitch');
  
  if (messagePrivacySwitch) {
    // Check saved preference
    const savedPreference = localStorage.getItem('messagePrivacy');
    if (savedPreference === 'enabled') {
      messagePrivacySwitch.checked = true;
    }
    
    messagePrivacySwitch.addEventListener('change', () => {
      if (messagePrivacySwitch.checked) {
        localStorage.setItem('messagePrivacy', 'enabled');
        showToast('Message privacy enabled', 'info');
      } else {
        localStorage.setItem('messagePrivacy', 'disabled');
        showToast('Message privacy disabled', 'info');
      }
    });
  }
}

// Danger zone buttons
function initializeDangerZoneButtons() {
  const deleteMessagesBtn = document.querySelector('.danger-action:nth-child(1) .btn-destructive');
  const deleteAccountBtn = document.querySelector('.danger-action:nth-child(2) .btn-destructive');
  
  if (deleteMessagesBtn) {
    deleteMessagesBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete all your messages? This action cannot be undone.')) {
        // Clear messages from localStorage
        localStorage.removeItem('favoriteMessages');
        localStorage.removeItem('archivedMessages');
        
        showToast('All messages have been deleted', 'success');
      }
    });
  }
  
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // In a real app, this would send a request to the server
        showToast('Account deletion initiated', 'info');
        
        // Simulate account deletion
        setTimeout(() => {
          // Clear all localStorage
          localStorage.clear();
          
          // Redirect to homepage
          window.location.href = 'index.html';
        }, 2000);
      }
    });
  }
}
