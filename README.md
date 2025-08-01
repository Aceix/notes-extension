# Jotta Note - Chrome Extension

A powerful and intuitive note-taking Chrome extension that allows you to quickly capture, organize, and manage your thoughts with project support.

## Features

### Core Functionality
- 📝 **Quick Note Taking**: Instantly create notes with a simple interface
- 🏷️ **Project System**: Organize notes with custom projects
- ✏️ **Edit & Delete**: Full CRUD operations for your notes
- 💾 **Persistent Storage**: All notes are saved locally using Chrome's storage API
- 🔍 **Search & Filter**: Find notes quickly with text search and project filtering

### Two Main Screens
1. **Notes Screen**: View all notes, create new ones, search and filter
2. **Projects Screen**: Manage all your projects, see usage statistics, and delete unused projects

### User Interface
- Clean and modern design
- Responsive layout optimized for the extension popup
- Intuitive navigation between notes and projects
- Modal-based editing interface
- Real-time search and filtering

## Installation

### For Development/Testing
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension will appear in your Chrome toolbar

### For Distribution
1. Package the extension as a ZIP file
2. Upload to Chrome Web Store (requires developer account)

## Usage

### Creating Notes
1. Click the extension icon in your Chrome toolbar
2. Type your note in the text area
3. Add projects (comma-separated) if desired
4. Click "Save Note" or press Ctrl+Enter

### Managing Notes
- **Edit**: Click the "Edit" button on any note to modify its content and projects
- **Delete**: Click the "Delete" button to remove a note (with confirmation)
- **Search**: Use the search box to find notes by content or projects
- **Filter**: Use the project dropdown to filter notes by specific projects

### Managing Projects
1. Switch to the "Projects" tab
2. View all projects with their usage counts
3. Delete projects (removes them from all notes)
4. Projects are automatically cleaned up when no longer used

## File Structure

```
notes-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── popup/
│   ├── popup.html         # Main popup interface
│   ├── popup.css          # Styling
│   └── popup.js           # Main functionality
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
└── README.md             # This file
```

## Technical Details

### Storage
- Uses Chrome's `storage.local` API for persistent data storage
- No external servers or cloud storage required
- All data remains on the user's local machine

### Permissions
- `storage`: For saving notes and projects locally
- `unlimitedStorage`: To allow large amounts of note data

### Browser Compatibility
- Chrome Extensions Manifest V3
- Works with Chrome 88+ and other Chromium-based browsers

## Data Format

### Notes Structure
```javascript
{
  id: timestamp,           // Unique identifier
  content: string,         // Note text content
  projects: array,         // Array of project strings
  createdAt: ISO_string,  // Creation timestamp
  updatedAt: ISO_string   // Last modification timestamp
}
```

### Projects Structure
```javascript
// Simple array of unique project strings
["work", "personal", "ideas", "todo"]
```

## Keyboard Shortcuts
- **Ctrl+Enter**: Save current note (while typing in note input)

## Contributing

Feel free to contribute to this project by:
1. Reporting bugs or issues
2. Suggesting new features
3. Submitting pull requests
4. Improving documentation

## Privacy

This extension:
- ✅ Stores all data locally on your device
- ✅ Does not collect or transmit any personal data
- ✅ Does not require internet connection
- ✅ Does not use external services or APIs

## License

This project is open source and available under the MIT License.

## Changelog

### Version 1.0.0
- Initial release
- Basic note creation, editing, and deletion
- Project management system
- Search and filter functionality
- Two-screen interface (Notes and Projects)
- Local storage persistence
