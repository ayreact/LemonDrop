
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Initialize signup form
  initializeSignupForm();
  
  // Initialize password toggles
  initializePasswordToggles();
  
  // Initialize social buttons
  initializeSocialButtons();
});

// Signup form
function initializeSignupForm() {
  const signupForm = document.getElementById('signupForm');
  
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      // Get form data
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const terms = document.getElementById('terms').checked;
      
      // Validate data
      if (!username || !email || !password || !confirmPassword) {
        showToast('Please fill in all required fields', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      
      if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
      }
      
      if (!terms) {
        showToast('You must agree to the Terms of Service', 'error');
        return;
      }
      
      // Show loading state
      const submitButton = signupForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.innerHTML = '<span class="loading-dots"></span>';
      submitButton.disabled = true;
      
      // In a real app, this would send data to a server
      console.log('Signup attempt:', { username, email, password, terms });
      
      // Simulate API request
      setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // For demo purposes, always succeed
        showToast('Account created successfully!', 'success');
        
        // Redirect to messages page
        setTimeout(() => {
          window.location.href = 'messages.html';
        }, 1000);
      }, 1500);
    });
  }
}

// Password toggles
function initializePasswordToggles() {
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  
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
  
  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', function() {
      const passwordInput = document.getElementById('confirmPassword');
      const passwordIcon = document.getElementById('confirmPasswordIcon');
      
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
      console.log(`${provider} signup initiated`);
      
      // Show info message
      showToast(`${provider} signup is not available in demo`, 'info');
    });
  });
}

// Loading dots animation
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .loading-dots:after {
      content: '...';
      animation: loading 1.5s infinite;
      display: inline-block;
      width: 1em;
      text-align: left;
    }
    
    @keyframes loading {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
    }
  </style>
`);
