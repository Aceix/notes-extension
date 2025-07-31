// Background script for the notes extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Notes extension installed');
  
  // Initialize default storage if needed
  chrome.storage.local.get(['notes', 'tags'], (result) => {
    if (!result.notes) {
      chrome.storage.local.set({ notes: [] });
    }
    if (!result.tags) {
      chrome.storage.local.set({ tags: [] });
    }
  });
});

// Handle keyboard shortcuts (if we add them later)
chrome.commands?.onCommand?.addListener((command) => {
  if (command === 'open-notes') {
    chrome.action.openPopup();
  }
});
