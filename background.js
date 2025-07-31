// Background script for the notes extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Notes extension installed');
  
  // Initialize default storage if needed
  chrome.storage.local.get(['notes', 'projects'], (result) => {
    if (!result.notes) {
      chrome.storage.local.set({ notes: [] });
    }
    if (!result.projects) {
      chrome.storage.local.set({ projects: [] });
    }
  });
});

// Handle keyboard shortcuts (if we add them later)
chrome.commands?.onCommand?.addListener((command) => {
  if (command === 'open-notes') {
    chrome.action.openPopup();
  }
});
