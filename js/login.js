
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Initialize login form
  initializeLoginForm();
  
  // Initialize password toggle
  initializePasswordToggle();
  
  // Initialize social buttons
  initializeSocialButtons();
});

// Login form
function initializeLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form data
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const remember = document.getElementById('remember')?.checked || false;
      
      // Validate data
      if (!email || !password) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.innerHTML = '<span class="loading-dots"></span>';
      submitButton.disabled = true;
      
      // In a real app, this would send data to a server
      console.log('Login attempt:', { email, password, remember });
      
      // Simulate API request
      setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // For demo purposes, always succeed
        showToast('Login successful, redirecting...', 'success');
        
        // Redirect to messages page
        setTimeout(() => {
          window.location.href = 'messages.html';
        }, 1000);
      }, 1500);
    });
  }
}

// Password toggle
function initializePasswordToggle() {
  const togglePassword = document.getElementById('togglePassword');
  
  if (togglePassword) {
    togglePassword.addEventListener('click', function() {
      const passwordInput = document.getElementById('password');
      const passwordIcon = document.getElementById('passwordIcon');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.setAttribute('data-lucide', 'eye-off');
      } else {
        passwordInput.type = 'password';
        passwordIcon.setAttribute('data-lucide', 'eye');
      }
      
      // Re-initialize the icon
      lucide.createIcons({
        icons: {
          'eye': passwordIcon,
          'eye-off': passwordIcon
        }
      });
    });
  }
}

// Social buttons
function initializeSocialButtons() {
  const socialButtons = document.querySelectorAll('.social-btn');
  
  socialButtons.forEach(button => {
    button.addEventListener('click', () => {
      const provider = button.textContent.trim();
      
      // In a real app, this would trigger OAuth flow
      console.log(`${provider} login initiated`);
      
      // Show info message
      showToast(`${provider} login is not available in demo`, 'info');
    });
  });
}
