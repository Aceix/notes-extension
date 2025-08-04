# Privacy Policy for Jotta Note Chrome Extension

**Last Updated:** August 4, 2025

## Overview

Jotta Note is a Chrome extension designed to help users create, organize, and manage notes locally on their device. This privacy policy explains how we handle your information when you use our extension.

## Information We Collect

### What We DON'T Collect
- We do not collect any personal information
- We do not track your browsing activity
- We do not collect analytics or usage statistics
- We do not transmit any data to external servers
- We do not use cookies or tracking technologies
- We do not access your browsing history
- We do not monitor which websites you visit

### What Data is Stored Locally
The extension stores the following data locally on your device using Chrome's storage API:

**Notes Data:**
- Note content (text you write)
- Project tags you assign to notes
- Creation and modification timestamps
- Unique identifiers for organizational purposes

**Projects Data:**
- Project names you create
- Project usage statistics (for display purposes only)

## How We Use Your Information

All data stored by Jotta Note is used exclusively for:
- Displaying your notes in the extension interface
- Organizing notes by projects
- Providing search and filter functionality
- Maintaining note creation and modification dates

## Data Storage and Security

### Local Storage Only
- All your notes and projects are stored locally on your device using Chrome's `storage.local` API
- No data is ever transmitted to external servers or cloud services
- Your data never leaves your device unless you explicitly choose to export or share it

### Data Security
- Data is stored using Chrome's secure storage mechanisms
- Only the Jotta Note extension can access its stored data
- No third parties have access to your information

## Data Sharing

We do not share, sell, rent, or otherwise distribute your data to any third parties because:
- We don't have access to your data (it's stored locally)
- We don't collect any analytics or usage information
- We don't have servers or databases that store user information

## Your Rights and Control

### Complete Control
You maintain complete control over your data:
- **Access:** You can view all your notes and projects within the extension
- **Modify:** You can edit or delete any notes or projects at any time
- **Export:** While not built into the extension, your data is stored in standard JSON format in Chrome's local storage
- **Delete:** You can remove the extension to delete all associated data

### Data Removal
To completely remove all data:
1. Delete all notes and projects within the extension, OR
2. Uninstall the extension from Chrome (this will remove all stored data)

## Permissions Explanation

The extension requests the following permissions:

### `storage`
- **Purpose:** To save your notes and projects locally on your device
- **Access:** Only to Chrome's local storage API, not your files or other browser data

### `unlimitedStorage`
- **Purpose:** To allow you to create as many notes as needed without storage limits
- **Access:** Does not provide access to any additional data, just removes storage quotas

## Children's Privacy

Our extension does not knowingly collect personal information from anyone, including children under 13. Since all data is stored locally and we don't collect any information, the extension is safe for users of all ages.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last Updated" date at the top of this policy. Continued use of the extension after any changes constitutes acceptance of the updated policy.

## Third-Party Services

Jotta Note does not integrate with or use any third-party services, analytics platforms, or external APIs.

## International Users

Since all data is stored locally on your device and we don't collect any information, this extension can be used by anyone worldwide without privacy concerns related to international data transfers.

## Contact Information

If you have any questions about this privacy policy or the extension's data practices, you can:
- Review the source code (if available in the repository)
- Contact us through the Chrome Web Store listing
- Submit issues or questions through the project's repository

## Technical Implementation

For transparency, here's how data is handled technically:
- Data is stored using `chrome.storage.local` API
- No network requests are made by the extension
- No external scripts or resources are loaded
- All functionality is contained within the extension package
