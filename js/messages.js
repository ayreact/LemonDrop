
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lucide icons
  lucide.createIcons();
  
  // Initialize tabs
  initializeTabs();
  
  // Initialize message actions
  initializeMessageActions();
  
  // Initialize dialogs
  initializeDialogs();
  
  // Initialize refresh button
  initializeRefreshButton();
});

// Tab functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to current button and content
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Message actions (favorite, archive, delete)
function initializeMessageActions() {
  // Favorite buttons
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const messageItem = button.closest('.message-item');
      const messageId = messageItem.getAttribute('data-id');
      toggleFavorite(messageId, button);
    });
  });
  
  // Delete buttons
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const messageItem = button.closest('.message-item');
      const messageId = messageItem.getAttribute('data-id');
      openDeleteDialog(messageId);
    });
  });
  
  // Share buttons
  const shareButtons = document.querySelectorAll('.share-btn');
  shareButtons.forEach(button => {
    button.addEventListener('click', () => {
      const messageItem = button.closest('.message-item');
      const messageText = messageItem.querySelector('.message-text').textContent;
      navigator.clipboard.writeText(messageText)
        .then(() => showToast('Message copied to clipboard', 'success'))
        .catch(() => showToast('Failed to copy message', 'error'));
    });
  });

  // Add archive functionality
  addArchiveButtons();
}

// Add archive buttons to messages
function addArchiveButtons() {
  const messageActions = document.querySelectorAll('.message-actions');
  
  messageActions.forEach(actionContainer => {
    // Skip if already has archive button
    if (actionContainer.querySelector('.archive-btn')) {
      return;
    }
    
    const archiveBtn = document.createElement('button');
    archiveBtn.className = 'action-btn archive-btn';
    archiveBtn.innerHTML = '<i data-lucide="archive" class="icon"></i>';
    
    // Insert before delete button
    const deleteBtn = actionContainer.querySelector('.delete-btn');
    actionContainer.insertBefore(archiveBtn, deleteBtn);
    
    // Initialize the new icon
    lucide.createIcons({
      icons: {
        archive: archiveBtn.querySelector('i[data-lucide="archive"]')
      }
    });
    
    // Add click event
    archiveBtn.addEventListener('click', () => {
      const messageItem = archiveBtn.closest('.message-item');
      const messageId = messageItem.getAttribute('data-id');
      archiveMessage(messageId);
    });
  });
}

// Toggle favorite status
function toggleFavorite(messageId, button) {
  // Get favorites from localStorage
  let favorites = JSON.parse(localStorage.getItem('favoriteMessages')) || [];
  
  if (button.classList.contains('active')) {
    // Remove from favorites
    favorites = favorites.filter(id => id !== messageId);
    button.classList.remove('active');
    showToast('Removed from favorites', 'info');
  } else {
    // Add to favorites
    if (!favorites.includes(messageId)) {
      favorites.push(messageId);
    }
    button.classList.add('active');
    showToast('Added to favorites', 'success');
  }
  
  // Save to localStorage
  localStorage.setItem('favoriteMessages', JSON.stringify(favorites));
  
  // Update favorites tab
  updateFavoritesTab();
}

// Archive a message
function archiveMessage(messageId) {
  // Get archived messages from localStorage
  let archived = JSON.parse(localStorage.getItem('archivedMessages')) || [];
  
  if (!archived.includes(messageId)) {
    archived.push(messageId);
    
    // Save to localStorage
    localStorage.setItem('archivedMessages', JSON.stringify(archived));
    
    // Move the message to archived tab
    moveMessageToArchived(messageId);
    
    showToast('Message archived', 'success');
  }
}

// Move message to archived tab
function moveMessageToArchived(messageId) {
  const messageItem = document.querySelector(`.message-item[data-id="${messageId}"]`);
  const archivedTab = document.getElementById('archivedTab');
  
  // If the archived tab is empty (has the empty message), remove it
  const emptyMessage = archivedTab.querySelector('.messages-empty');
  if (emptyMessage) {
    emptyMessage.remove();
    
    // Create messages list if it doesn't exist
    if (!archivedTab.querySelector('.messages-list')) {
      const messagesList = document.createElement('div');
      messagesList.className = 'messages-list';
      archivedTab.appendChild(messagesList);
    }
  }
  
  // Clone the message and add to archived tab
  const messagesList = archivedTab.querySelector('.messages-list');
  const clonedMessage = messageItem.cloneNode(true);
  messagesList.appendChild(clonedMessage);
  
  // Initialize the actions on the cloned message
  const archiveBtn = clonedMessage.querySelector('.archive-btn');
  if (archiveBtn) {
    archiveBtn.remove(); // Remove archive button from archived messages
  }
  
  // Re-initialize the icons in the cloned message
  lucide.createIcons({
    icons: {
      star: clonedMessage.querySelector('i[data-lucide="star"]'),
      share: clonedMessage.querySelector('i[data-lucide="share"]'),
      'trash-2': clonedMessage.querySelector('i[data-lucide="trash-2"]')
    }
  });
  
  // Remove from current tab
  messageItem.remove();
}

// Update favorites tab
function updateFavoritesTab() {
  const favorites = JSON.parse(localStorage.getItem('favoriteMessages')) || [];
  const favoriteTab = document.getElementById('favoriteTab');
  const allMessages = document.querySelectorAll('#allTab .message-item');
  
  // Clear favorites tab
  favoriteTab.innerHTML = '';
  
  if (favorites.length === 0) {
    // Show empty message
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'messages-empty text-center';
    emptyMessage.innerHTML = `
      <i data-lucide="star" class="icon icon-lg text-muted"></i>
      <p class="text-muted">No favorite messages</p>
    `;
    favoriteTab.appendChild(emptyMessage);
    
    // Initialize the icon
    lucide.createIcons({
      icons: {
        star: emptyMessage.querySelector('i[data-lucide="star"]')
      }
    });
  } else {
    // Create messages list
    const messagesList = document.createElement('div');
    messagesList.className = 'messages-list';
    favoriteTab.appendChild(messagesList);
    
    // Add favorite messages
    allMessages.forEach(message => {
      const messageId = message.getAttribute('data-id');
      if (favorites.includes(messageId)) {
        const clonedMessage = message.cloneNode(true);
        messagesList.appendChild(clonedMessage);
      }
    });
    
    // Re-initialize the icons in the favorites tab
    const iconElements = favoriteTab.querySelectorAll('[data-lucide]');
    lucide.createIcons({
      icons: Array.from(iconElements).reduce((acc, icon) => {
        acc[icon.getAttribute('data-lucide')] = icon;
        return acc;
      }, {})
    });
  }
}

// Dialog functionality
function initializeDialogs() {
  // Share dialog
  const shareDialog = document.getElementById('shareDialog');
  const openShareButton = document.getElementById('openShareDialog');
  const closeShareButton = shareDialog.querySelector('.dialog-close');
  const copyLinkButton = document.getElementById('copyLink');
  
  openShareButton.addEventListener('click', () => {
    shareDialog.classList.add('active');
  });
  
  closeShareButton.addEventListener('click', () => {
    shareDialog.classList.remove('active');
  });
  
  copyLinkButton.addEventListener('click', () => {
    const shareLinkInput = document.getElementById('shareLink');
    shareLinkInput.select();
    document.execCommand('copy');
    showToast('Link copied to clipboard', 'success');
  });
  
  // Delete dialog
  const deleteDialog = document.getElementById('deleteDialog');
  const closeDeleteButton = deleteDialog.querySelector('.dialog-close');
  const cancelDeleteButton = document.getElementById('cancelDelete');
  const confirmDeleteButton = document.getElementById('confirmDelete');
  
  closeDeleteButton.addEventListener('click', () => {
    deleteDialog.classList.remove('active');
    deleteDialog.removeAttribute('data-message-id');
  });
  
  cancelDeleteButton.addEventListener('click', () => {
    deleteDialog.classList.remove('active');
    deleteDialog.removeAttribute('data-message-id');
  });
  
  confirmDeleteButton.addEventListener('click', () => {
    const messageId = deleteDialog.getAttribute('data-message-id');
    if (messageId) {
      deleteMessage(messageId);
    }
    deleteDialog.classList.remove('active');
    deleteDialog.removeAttribute('data-message-id');
  });
  
  // Close dialogs when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === shareDialog) {
      shareDialog.classList.remove('active');
    }
    if (event.target === deleteDialog) {
      deleteDialog.classList.remove('active');
      deleteDialog.removeAttribute('data-message-id');
    }
  });
}

// Open delete dialog
function openDeleteDialog(messageId) {
  const deleteDialog = document.getElementById('deleteDialog');
  deleteDialog.setAttribute('data-message-id', messageId);
  deleteDialog.classList.add('active');
}

// Delete message
function deleteMessage(messageId) {
  // Remove from DOM
  const messageItems = document.querySelectorAll(`.message-item[data-id="${messageId}"]`);
  messageItems.forEach(item => item.remove());
  
  // Remove from favorites if it's there
  let favorites = JSON.parse(localStorage.getItem('favoriteMessages')) || [];
  favorites = favorites.filter(id => id !== messageId);
  localStorage.setItem('favoriteMessages', JSON.stringify(favorites));
  
  // Remove from archived if it's there
  let archived = JSON.parse(localStorage.getItem('archivedMessages')) || [];
  archived = archived.filter(id => id !== messageId);
  localStorage.setItem('archivedMessages', JSON.stringify(archived));
  
  // Show empty message if needed
  checkEmptyTabs();
  
  showToast('Message deleted', 'success');
}

// Check for empty tabs and show empty message if needed
function checkEmptyTabs() {
  const tabs = ['favoriteTab', 'archivedTab'];
  
  tabs.forEach(tabId => {
    const tab = document.getElementById(tabId);
    const messagesList = tab.querySelector('.messages-list');
    
    if (!messagesList || messagesList.children.length === 0) {
      tab.innerHTML = '';
      
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'messages-empty text-center';
      
      if (tabId === 'favoriteTab') {
        emptyMessage.innerHTML = `
          <i data-lucide="star" class="icon icon-lg text-muted"></i>
          <p class="text-muted">No favorite messages</p>
        `;
      } else if (tabId === 'archivedTab') {
        emptyMessage.innerHTML = `
          <i data-lucide="archive" class="icon icon-lg text-muted"></i>
          <p class="text-muted">No archived messages</p>
        `;
      }
      
      tab.appendChild(emptyMessage);
      
      // Initialize the icon
      lucide.createIcons({
        icons: {
          [tabId === 'favoriteTab' ? 'star' : 'archive']: emptyMessage.querySelector('i[data-lucide]')
        }
      });
    }
  });
}

// Initialize refresh button
function initializeRefreshButton() {
  const refreshButton = document.querySelector('.btn-primary');
  
  refreshButton.addEventListener('click', () => {
    showToast('Messages refreshed', 'info');
    
    // Mock refresh - in a real app, this would fetch new messages
    const refreshIcon = refreshButton.querySelector('i[data-lucide="refresh-cw"]');
    refreshIcon.classList.add('spinning');
    
    setTimeout(() => {
      refreshIcon.classList.remove('spinning');
    }, 1000);
  });
}

// Toast notification
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'error') iconName = 'alert-circle';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="icon toast-icon"></i>
    <div class="toast-message">${message}</div>
    <button class="toast-close">&times;</button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Initialize the icon
  lucide.createIcons({
    icons: {
      [iconName]: toast.querySelector(`i[data-lucide="${iconName}"]`)
    }
  });
  
  // Add close functionality
  const closeButton = toast.querySelector('.toast-close');
  closeButton.addEventListener('click', () => {
    toast.remove();
  });
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Load data on page load
window.addEventListener('load', () => {
  // Load favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem('favoriteMessages')) || [];
  
  // Mark favorite buttons as active
  favorites.forEach(messageId => {
    const favoriteBtn = document.querySelector(`.message-item[data-id="${messageId}"] .favorite-btn`);
    if (favoriteBtn) {
      favoriteBtn.classList.add('active');
    }
  });
  
  // Load archived messages from localStorage
  const archived = JSON.parse(localStorage.getItem('archivedMessages')) || [];
  
  // Move archived messages to archived tab
  archived.forEach(messageId => {
    const messageItem = document.querySelector(`.message-item[data-id="${messageId}"]`);
    if (messageItem) {
      moveMessageToArchived(messageId);
    }
  });
  
  // Update favorites tab
  updateFavoritesTab();
  
  // Check for empty tabs
  checkEmptyTabs();
});
