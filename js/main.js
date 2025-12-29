
// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize dark mode
  initializeDarkMode();
  
  // Initialize mobile menu
  initializeMobileMenu();
  
  // Initialize toast notifications
  initializeToasts();

  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// Dark mode functionality
function initializeDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeIcon = document.getElementById('darkModeIcon');
  const html = document.documentElement;
  const body = document.body;
  
  // Check for saved dark mode preference
  const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
  
  // Set initial dark mode state
  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  
  // Toggle dark mode when button is clicked
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      if (html.classList.contains('dark') || body.classList.contains('dark-mode')) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    });
  }
  
  function enableDarkMode() {
    html.classList.add('dark');
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    if (darkModeIcon) {
      darkModeIcon.setAttribute('data-lucide', 'sun');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }
  
  function disableDarkMode() {
    html.classList.remove('dark');
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    if (darkModeIcon) {
      darkModeIcon.setAttribute('data-lucide', 'moon');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Change menu icon based on menu state
      const menuIcon = mobileMenuBtn.querySelector('[data-lucide]');
      if (menuIcon) {
        const isOpen = navLinks.classList.contains('active');
        menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    });
  }
}

// Toast notifications functionality
function initializeToasts() {
  window.showToast = function(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set toast icon based on type
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';
    
    // Set toast content
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${iconName}" class="icon"></i>
      </div>
      <div class="toast-message">${message}</div>
      <button class="toast-close"><i data-lucide="x" class="icon"></i></button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Initialize icons in the toast
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          class: ["icon"]
        }
      });
    }
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        toast.style.opacity = '0';
        setTimeout(() => {
          toast.remove();
        }, 300);
      });
    }
    
    // Auto-remove toast after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  };
}
