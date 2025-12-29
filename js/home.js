
document.addEventListener('DOMContentLoaded', () => {
  const generateLinkBtn = document.getElementById('generateLink');
  const generateLinkCtaBtn = document.getElementById('generateLinkCta');
  const generatedLinkContainer = document.getElementById('generatedLinkContainer');
  const generatedLinkElement = document.getElementById('generatedLink');
  const copyButton = document.getElementById('copyButton');
  
  // Function to generate a random link
  const generateRandomLink = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${window.location.origin}/send/${randomString}`;
  };
  
  // Function to handle link generation
  const handleGenerateLink = () => {
    const link = generateRandomLink();
    
    if (generatedLinkElement && generatedLinkContainer) {
      generatedLinkElement.textContent = link;
      generatedLinkContainer.classList.remove('hidden');
      
      // Show toast
      window.showToast('Link Generated!', 'Share this link with friends to receive anonymous messages.');
      
      // Scroll to the link if not visible
      setTimeout(() => {
        generatedLinkContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };
  
  // Function to copy the generated link
  const handleCopyLink = () => {
    if (generatedLinkElement) {
      const link = generatedLinkElement.textContent;
      navigator.clipboard.writeText(link)
        .then(() => {
          // Success
          window.showToast('Link Copied!', 'The link has been copied to your clipboard.');
          
          // Change icon temporarily
          const icon = copyButton.querySelector('.icon');
          icon.setAttribute('data-lucide', 'check-check');
          lucide.createIcons();
          
          // Reset icon after 2 seconds
          setTimeout(() => {
            icon.setAttribute('data-lucide', 'copy');
            lucide.createIcons();
          }, 2000);
        })
        .catch(err => {
          // Error
          window.showToast('Error', 'Failed to copy link. Please try again.', 'error');
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  // Add event listeners
  if (generateLinkBtn) {
    generateLinkBtn.addEventListener('click', handleGenerateLink);
  }
  
  if (generateLinkCtaBtn) {
    generateLinkCtaBtn.addEventListener('click', handleGenerateLink);
  }
  
  if (copyButton) {
    copyButton.addEventListener('click', handleCopyLink);
  }
});
