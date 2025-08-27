// Notes Extension - Main JavaScript File

class NotesManager {
  constructor() {
    this.notes = [];
    this.projects = []; // Now an array of objects: { name: string, color: string }
    this.currentEditingNote = null;
    this.selectedProject = null; // Now an object: { name: string, color: string }
    this.autocompleteIndex = -1;
    this.currentView = "add"; // 'add' or 'list'
    this.currentEditor = null; // Track which editor is currently active

    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.setupRichTextEditor();
    this.updateProjectFilter();
    this.setupEmojiPickers();

    // Start in add note view
    this.showAddNoteView();

    // Only render projects initially
    this.renderProjects();
  }

  // Rich Text Editor Setup
  setupRichTextEditor() {
    // Setup main editor
    const mainEditor = document.getElementById("noteInput");
    this.setupEditorInstance(mainEditor);

    // Setup modal editor
    const modalEditor = document.getElementById("editNoteText");
    this.setupEditorInstance(modalEditor);

    // Setup toolbar event listeners
    this.setupToolbarListeners();
  }

  setupEditorInstance(editor) {
    if (!editor) return;

    // Handle keyboard shortcuts
    editor.addEventListener("keydown", (e) => {
      // Ctrl+Enter to save (for main editor)
      if (e.ctrlKey && e.key === "Enter" && editor.id === "noteInput") {
        e.preventDefault();
        this.saveNote();
        return;
      }

      // Handle common formatting shortcuts
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            this.executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            this.executeCommand("italic");
            break;
          case "u":
            e.preventDefault();
            this.executeCommand("underline");
            break;
          case "`":
            e.preventDefault();
            this.executeCommand("code");
            break;
          case "k":
            e.preventDefault();
            this.executeCommand("createLink");
            break;
        }
      }
    });

    // Track focus for toolbar updates
    editor.addEventListener("focus", () => {
      this.currentEditor = editor;
      this.updateToolbarState();
    });

    editor.addEventListener("mouseup", () => {
      if (this.currentEditor === editor) {
        this.updateToolbarState();
      }
    });

    editor.addEventListener("keyup", () => {
      if (this.currentEditor === editor) {
        this.updateToolbarState();
      }
    });
  }

  setupToolbarListeners() {
    // Setup main toolbar
    const mainToolbar = document.querySelector(
      ".rich-text-toolbar:not(.modal-toolbar)"
    );
    if (mainToolbar) {
      this.setupToolbarInstance(
        mainToolbar,
        document.getElementById("noteInput")
      );
    }

    // Setup modal toolbar
    const modalToolbar = document.querySelector(".modal-toolbar");
    if (modalToolbar) {
      this.setupToolbarInstance(
        modalToolbar,
        document.getElementById("editNoteText")
      );
    }
  }

  setupToolbarInstance(toolbar, editor) {
    if (!toolbar || !editor) return;

    toolbar.addEventListener("click", (e) => {
      const btn = e.target.closest(".toolbar-btn");
      if (!btn) return;

      e.preventDefault();

      // Set current editor
      this.currentEditor = editor;

      const command = btn.dataset.command;
      this.executeCommand(command);

      // Focus back to editor
      editor.focus();

      // Update toolbar state
      setTimeout(() => this.updateToolbarState(), 10);
    });
  }

  setupEmojiPickers() {
    // Main editor
    const emojiBtn = document.getElementById("emoji-btn");
    const emojiPickerContainer = document.getElementById("emojiPickerContainer");
    const emojiPicker = emojiPickerContainer.querySelector("emoji-picker");

    emojiBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      emojiPickerContainer.style.display =
        emojiPickerContainer.style.display === "none" ? "block" : "none";
    });

    if (emojiPicker) {
      emojiPicker.addEventListener("emoji-click", (event) => {
        this.insertEmoji(event.detail.unicode);
        emojiPickerContainer.style.display = "none";
      });
    }

    // Modal editor
    const emojiBtnModal = document.getElementById("emoji-btn-modal");
    const emojiPickerContainerModal = document.getElementById(
      "emojiPickerContainerModal"
    );
    const emojiPickerModal =
      emojiPickerContainerModal.querySelector("emoji-picker");

    emojiBtnModal.addEventListener("click", (e) => {
      e.stopPropagation();
      emojiPickerContainerModal.style.display =
        emojiPickerContainerModal.style.display === "none" ? "block" : "none";
    });

    if (emojiPickerModal) {
      emojiPickerModal.addEventListener("emoji-click", (event) => {
        this.insertEmoji(event.detail.unicode);
        emojiPickerContainerModal.style.display = "none";
      });
    }

    // Hide picker when clicking outside
    document.addEventListener("click", (e) => {
      if (
        emojiPickerContainer.style.display === "block" &&
        !emojiPickerContainer.contains(e.target) &&
        e.target !== emojiBtn
      ) {
        emojiPickerContainer.style.display = "none";
      }
      if (
        emojiPickerContainerModal.style.display === "block" &&
        !emojiPickerContainerModal.contains(e.target) &&
        e.target !== emojiBtnModal
      ) {
        emojiPickerContainerModal.style.display = "none";
      }
    });
  }

  insertEmoji(emoji) {
    if (!this.currentEditor) return;

    this.currentEditor.focus();
    document.execCommand("insertText", false, emoji);
  }

  setupEditorInstance(editor) {
    if (!editor) return;

    // Handle keyboard shortcuts
    editor.addEventListener("keydown", (e) => {
      // Ctrl+Enter to save (for main editor)
      if (e.ctrlKey && e.key === "Enter" && editor.id === "noteInput") {
        e.preventDefault();
        this.saveNote();
        return;
      }

      // Handle common formatting shortcuts
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            this.executeCommand("bold");
            break;
          case "i":
            e.preventDefault();
            this.executeCommand("italic");
            break;
          case "u":
            e.preventDefault();
            this.executeCommand("underline");
            break;
          case "`":
            e.preventDefault();
            this.executeCommand("code");
            break;
          case "k":
            e.preventDefault();
            this.executeCommand("createLink");
            break;
        }
      }
    });

    // Track focus for toolbar updates
    editor.addEventListener("focus", () => {
      this.currentEditor = editor;
      this.updateToolbarState();
    });

    editor.addEventListener("mouseup", () => {
      if (this.currentEditor === editor) {
        this.updateToolbarState();
      }
    });

    editor.addEventListener("keyup", () => {
      if (this.currentEditor === editor) {
        this.updateToolbarState();
      }
    });
  }

  setupToolbarListeners() {
    // Setup main toolbar
    const mainToolbar = document.querySelector(
      ".rich-text-toolbar:not(.modal-toolbar)"
    );
    if (mainToolbar) {
      this.setupToolbarInstance(
        mainToolbar,
        document.getElementById("noteInput")
      );
    }

    // Setup modal toolbar
    const modalToolbar = document.querySelector(".modal-toolbar");
    if (modalToolbar) {
      this.setupToolbarInstance(
        modalToolbar,
        document.getElementById("editNoteText")
      );
    }
  }

  setupToolbarInstance(toolbar, editor) {
    if (!toolbar || !editor) return;

    toolbar.addEventListener("click", (e) => {
      const btn = e.target.closest(".toolbar-btn");
      if (!btn) return;

      e.preventDefault();

      // Set current editor
      this.currentEditor = editor;

      const command = btn.dataset.command;
      this.executeCommand(command);

      // Focus back to editor
      editor.focus();

      // Update toolbar state
      setTimeout(() => this.updateToolbarState(), 10);
    });
  }

  executeCommand(command) {
    if (!this.currentEditor) return;

    // Focus the editor first
    this.currentEditor.focus();

    try {
      // Handle custom commands
      if (command === "code") {
        this.insertInlineCode();
      } else if (command === "codeBlock") {
        this.insertCodeBlock();
      } else if (command === "createLink") {
        this.insertLink();
      } else if (command === "insertImage") {
        this.openImageModal();
      } else {
        // Standard document commands
        document.execCommand(command, false, null);
      }
    } catch (e) {
      console.warn("Command execution failed:", command, e);
    }
  }

  // Custom formatting methods
  insertInlineCode() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      // Wrap selected text in code tags
      const codeElement = document.createElement("code");
      codeElement.textContent = selectedText;
      range.deleteContents();
      range.insertNode(codeElement);

      // Move cursor after the code element
      range.setStartAfter(codeElement);
      range.setEndAfter(codeElement);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Insert empty code tags with cursor inside
      const codeElement = document.createElement("code");
      codeElement.textContent = "code";
      range.insertNode(codeElement);

      // Select the placeholder text
      range.selectNodeContents(codeElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  insertCodeBlock() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // Create pre > code structure
    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");

    codeElement.textContent = selectedText || "// Your code here";
    preElement.appendChild(codeElement);

    // Insert the code block
    if (selectedText) {
      range.deleteContents();
    }
    range.insertNode(preElement);

    // Add a paragraph after the code block for continued typing
    const p = document.createElement("p");
    p.innerHTML = "&nbsp;";
    preElement.parentNode.insertBefore(p, preElement.nextSibling);

    // Select the code content
    range.selectNodeContents(codeElement);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  insertLink() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // Prompt for URL
    const url = prompt("Enter the URL:", "https://");
    if (!url || url === "https://") return;

    // Create link element
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.textContent = selectedText || url;
    linkElement.target = "_blank"; // Open in new tab
    linkElement.rel = "noopener noreferrer"; // Security

    if (selectedText) {
      range.deleteContents();
    }
    range.insertNode(linkElement);

    // Move cursor after the link
    range.setStartAfter(linkElement);
    range.setEndAfter(linkElement);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Image Insertion Logic
  openImageModal() {
    if (!this.currentEditor) return;
    document.getElementById("imageModal").classList.add("active");
  }

  closeImageModal() {
    document.getElementById("imageModal").classList.remove("active");
    document.getElementById("imageUrlInput").value = "";
    document.getElementById("imageFileInput").value = "";
  }

  insertImage(src) {
    if (!this.currentEditor || !src) return;

    this.currentEditor.focus();
    const img = `<img src="${src}" alt="User inserted image" style="max-width: 100%; height: auto; display: block;">`;
    document.execCommand("insertHTML", false, img);
    this.closeImageModal();
  }

  handleImageInsert() {
    const activeTab = document.querySelector(".image-source-tabs .tab-btn.active").dataset.tab;

    if (activeTab === "url") {
      const imageUrl = document.getElementById("imageUrlInput").value.trim();
      if (imageUrl) {
        this.insertImage(imageUrl);
      } else {
        alert("Please enter an image URL.");
      }
    } else if (activeTab === "upload") {
      const fileInput = document.getElementById("imageFileInput");
      const file = fileInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.insertImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file.");
      }
    }
  }

  updateToolbarState() {
    if (!this.currentEditor) return;

    // Find the appropriate toolbar for the current editor
    let toolbar;
    if (this.currentEditor.id === "noteInput") {
      toolbar = document.querySelector(
        ".rich-text-toolbar:not(.modal-toolbar)"
      );
    } else if (this.currentEditor.id === "editNoteText") {
      toolbar = document.querySelector(".modal-toolbar");
    }

    if (!toolbar) return;

    const commands = [
      "bold",
      "italic",
      "underline",
      "insertUnorderedList",
      "insertOrderedList",
    ];

    commands.forEach((command) => {
      const btn = toolbar.querySelector(`[data-command="${command}"]`);
      if (btn) {
        const isActive = document.queryCommandState(command);
        btn.classList.toggle("active", isActive);
      }
    });

    // Handle custom commands that don't have queryCommandState support
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const element =
        container.nodeType === Node.TEXT_NODE
          ? container.parentElement
          : container;

      // Check for code formatting
      const codeBtn = toolbar.querySelector('[data-command="code"]');
      if (codeBtn) {
        const isInCode = element.closest("code") !== null;
        codeBtn.classList.toggle("active", isInCode);
      }

      // Check for code block formatting
      const codeBlockBtn = toolbar.querySelector('[data-command="codeBlock"]');
      if (codeBlockBtn) {
        const isInCodeBlock = element.closest("pre") !== null;
        codeBlockBtn.classList.toggle("active", isInCodeBlock);
      }

      // Check for link formatting
      const linkBtn = toolbar.querySelector('[data-command="createLink"]');
      if (linkBtn) {
        const isInLink = element.closest("a") !== null;
        linkBtn.classList.toggle("active", isInLink);
      }
    }
  }

  // Get rich text content from editor
  getEditorContent(editor) {
    if (!editor) return "";
    return editor.innerHTML.trim();
  }

  // Set rich text content to editor
  setEditorContent(editor, content) {
    if (!editor) return;

    // If content is plain text (legacy notes), wrap in paragraph
    if (content && !content.includes("<") && !content.includes(">")) {
      // Convert plain text to HTML, preserving line breaks
      const lines = content.split("\n").filter((line) => line.trim());
      if (lines.length > 1) {
        // Multiple lines - wrap each in a paragraph
        const htmlContent = lines
          .map((line) => `<p>${this.escapeHtml(line)}</p>`)
          .join("");
        editor.innerHTML = htmlContent;
      } else if (lines.length === 1) {
        // Single line - just wrap in paragraph
        editor.innerHTML = `<p>${this.escapeHtml(lines[0])}</p>`;
      } else {
        // Empty content
        editor.innerHTML = "";
      }
    } else {
      // Already HTML content or empty
      editor.innerHTML = content || "";
    }
  }

  // Convert rich text to plain text for search
  stripHtml(html) {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  }

  // Data Management
  async loadData() {
    const result = await chrome.storage.local.get(["notes", "projects"]);
    this.notes = result.notes || [];

    // Migration for project structure
    const projects = result.projects || [];
    if (projects.length > 0 && typeof projects[0] === "string") {
      // Old format: array of strings. Convert to new format.
      this.projects = projects.map((name) => ({
        name,
        color: getRandomColor(),
      }));
      await this.saveData(); // Save the migrated data
    } else {
      this.projects = projects;
    }
  }

  async saveData() {
    await chrome.storage.local.set({
      notes: this.notes,
      projects: this.projects,
    });
  }

  // Event Listeners
  setupEventListeners() {
    // Navigation
    document
      .getElementById("notesTab")
      .addEventListener("click", () => this.handleNotesTabClick());
    document
      .getElementById("projectsTab")
      .addEventListener("click", () => this.switchTab("projects"));
    document
      .getElementById("new-note-btn")
      .addEventListener("click", () => this.goToNewNoteScreen());

    // Note Management
    document
      .getElementById("saveNoteBtn")
      .addEventListener("click", () => this.saveNote());

    const noteInput = document.getElementById("noteInput");
    if (noteInput) {
      noteInput.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
          this.saveNote();
        }
      });
    }

    // Project Input Management
    document.getElementById("addProjectBtn").addEventListener("click", (e) => {
      if (e.target.dataset.action === "remove-project") {
        this.clearSelectedProject();
      } else if (!this.selectedProject) {
        this.showProjectInput();
        document
          .getElementById("projectInput")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
    document
      .getElementById("confirmProject")
      .addEventListener("click", () => this.confirmProject());
    document
      .getElementById("cancelProject")
      .addEventListener("click", () => this.hideProjectInput());
    document
      .getElementById("projectInput")
      .addEventListener("input", (e) => this.handleProjectInput(e));
    document
      .getElementById("projectInput")
      .addEventListener("keydown", (e) => this.handleProjectKeydown(e));
    document
      .getElementById("projectAutocomplete")
      .addEventListener("click", (e) => this.handleAutocompleteClick(e));

    // Search and Filter
    const searchInput = document.getElementById("searchInput");
    const projectFilter = document.getElementById("projectFilter");
    const clearFilterBtn = document.getElementById("clearFilterBtn");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterNotes());
    }
    if (projectFilter) {
      projectFilter.addEventListener("change", () => this.filterNotes());
    }
    if (clearFilterBtn) {
      clearFilterBtn.addEventListener("click", () => this.clearFilters());
    }

    // Modal
    document
      .getElementById("updateNote")
      .addEventListener("click", () => this.updateNote());
    document
      .getElementById("cancelEdit")
      .addEventListener("click", () => this.closeModal());
    document
      .querySelector(".close")
      .addEventListener("click", () => this.closeModal());

    // Image Modal
    document.getElementById("closeImageModal").addEventListener("click", () => this.closeImageModal());
    document.getElementById("cancelImageBtn").addEventListener("click", () => this.closeImageModal());
    document.getElementById("insertImageBtn").addEventListener("click", () => this.handleImageInsert());
    document.querySelectorAll(".image-source-tabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".image-source-tabs .tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
        document.getElementById(btn.dataset.tab === "url" ? "imageUrlTab" : "imageUploadTab").classList.add("active");
      });
    });


    // Projects Management
    // document
    //   .getElementById("refreshProjects")
    //   .addEventListener("click", () => this.renderProjects());

    // Event delegation for dynamically created note buttons
    document.getElementById("notesList").addEventListener("click", (e) => {
      // Handle edit button click
      if (e.target.closest(".edit-btn")) {
        const editBtn = e.target.closest(".edit-btn");
        const noteId = parseInt(editBtn.dataset.id.replace("edit-", ""));
        this.editNote(noteId);
      }
      // Handle delete button click
      else if (e.target.closest(".delete-btn")) {
        const deleteBtn = e.target.closest(".delete-btn");
        const noteId = parseInt(deleteBtn.dataset.id.replace("delete-", ""));
        this.deleteNote(noteId);
      }
      // Handle note item click for editing (but not when clicking action buttons)
      else if (
        e.target.closest(".note-item") &&
        !e.target.closest(".note-actions")
      ) {
        const noteItem = e.target.closest(".note-item");
        const noteId = parseInt(noteItem.dataset.id);
        this.editNote(noteId);
      }
    });

    // Event delegation for project clicks
    document.getElementById("projectsList").addEventListener("click", (e) => {
      const projectCard = e.target.closest(".project-card");
      if (!projectCard) return;

      // Handle delete button click
      if (e.target.closest(".delete-btn")) {
        const deleteBtn = e.target.closest(".delete-btn");
        const projectName = deleteBtn.dataset.project;
        this.deleteProject(projectName);
      } else {
        // Handle project card click to filter notes
        const projectName = projectCard.dataset.project;
        if (projectName) {
          document.getElementById("projectFilter").value = projectName;
          this.switchTab("notes");
          this.showNotesListView();
        }
      }
    });

    // Close modal when clicking outside
    document.getElementById("editModal").addEventListener("click", (e) => {
      if (e.target.id === "editModal") {
        this.closeModal();
      }
    });

    document.getElementById("imageModal").addEventListener("click", (e) => {
      if (e.target.id === "imageModal") {
        this.closeImageModal();
      }
    });

    // Close autocomplete when clicking outside
    document.addEventListener("click", (e) => {
      const autocomplete = document.getElementById("projectAutocomplete");
      const projectInputContainer = document.querySelector(
        "#projectInputSection .project-input-container"
      );

      // Check if click is outside the project input section
      if (
        !projectInputContainer.contains(e.target) &&
        autocomplete.classList.contains("show")
      ) {
        autocomplete.classList.remove("show");
        this.autocompleteIndex = -1;
      }
    });
  }

  // Tab Management
  handleNotesTabClick() {
    this.switchTab("notes");
    // If we're on the notes tab, show list view by default
    if (this.notes.length > 0) {
      this.showNotesListView();
    } else {
      this.showAddNoteView();
    }
  }

  switchTab(tab) {
    // Update navigation buttons
    document
      .querySelectorAll(".nav-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document.getElementById(tab + "Tab").classList.add("active");

    // Update screens
    document
      .querySelectorAll(".screen")
      .forEach((screen) => screen.classList.remove("active"));
    document.getElementById(tab + "Screen").classList.add("active");

    if (tab === "projects") {
      this.renderProjects();
    }
  }

  // View Management
  showAddNoteView() {
    document
      .querySelectorAll(".view")
      .forEach((view) => view.classList.remove("active"));
    document.getElementById("addNoteView").classList.add("active");
    this.currentView = "add";

    // Focus on rich text editor
    setTimeout(() => {
      const noteInput = document.getElementById("noteInput");
      noteInput.focus();
      this.currentEditor = noteInput;
    }, 100);
  }

  showNotesListView() {
    document
      .querySelectorAll(".view")
      .forEach((view) => view.classList.remove("active"));
    document.getElementById("notesListView").classList.add("active");
    this.currentView = "list";
    this.renderNotes();
    this.updateClearButtonVisibility();
  }

  goToNewNoteScreen() {
    this.switchTab("notes");
    this.showAddNoteView();
  }

  // Note Management
  async saveNote() {
    const noteEditor = document.getElementById("noteInput");
    const noteContent = this.getEditorContent(noteEditor);
    const noteText = this.stripHtml(noteContent).trim();

    if (!noteText) {
      alert("Please enter a note");
      return;
    }

    const projects = this.selectedProject ? [this.selectedProject.name] : [];

    const note = {
      id: Date.now(),
      content: noteContent, // Store rich HTML content
      projects: projects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.unshift(note);
    if (this.selectedProject) {
      this.updateProjectsList([this.selectedProject]);
    }

    await this.saveData();

    // Clear form
    this.setEditorContent(noteEditor, "");
    this.clearSelectedProject();

    this.renderNotes();
    this.updateProjectFilter();

    // Show success feedback and switch to list view
    this.showNotification("Note saved successfully!");
    this.showNotesListView();
  }

  clearFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("projectFilter").value = "";
    this.filterNotes();
  }

  updateClearButtonVisibility() {
    const searchInput = document.getElementById("searchInput");
    const projectFilter = document.getElementById("projectFilter");
    const clearFilterBtn = document.getElementById("clearFilterBtn");

    const isSearchActive = searchInput.value.trim() !== "";
    const isFilterActive = projectFilter.value !== "";

    if (isSearchActive || isFilterActive) {
      clearFilterBtn.style.display = "flex";
    } else {
      clearFilterBtn.style.display = "none";
    }
  }

  // Project Input Management
  showProjectInput() {
    const projectSection = document.getElementById("projectInputSection");
    const projectInput = document.getElementById("projectInput");
    const projectColor = document.getElementById("projectColor");

    projectColor.value = getRandomColor();
    projectSection.style.display = "block";
    projectInput.focus();
    // this.updateAutocomplete('');
  }

  hideProjectInput() {
    const projectSection = document.getElementById("projectInputSection");
    const projectInput = document.getElementById("projectInput");
    const autocomplete = document.getElementById("projectAutocomplete");
    const colorInput = document.getElementById("projectColor");

    projectSection.style.display = "none";
    projectInput.value = "";
    colorInput.style.display = "none";
    autocomplete.classList.remove("show");
    this.autocompleteIndex = -1;
  }

  confirmProject() {
    const projectInput = document.getElementById("projectInput");
    const colorInput = document.getElementById("projectColor");
    const projectName = projectInput.value.trim();

    if (projectName) {
      const existingProject = this.projects.find(
        (p) => p.name.toLowerCase() === projectName.toLowerCase()
      );
      if (existingProject) {
        this.selectedProject = existingProject;
      } else {
        this.selectedProject = { name: projectName, color: colorInput.value };
      }

      this.hideProjectInput();
      this.showSelectedProject();

      // Automatically save the note when project is selected
      this.saveNote();
    }
  }

  showSelectedProject() {
    const addProjectBtn = document.getElementById("addProjectBtn");

    if (this.selectedProject) {
      addProjectBtn.innerHTML = `
        <span class="selected-project" style="background-color: ${
          this.selectedProject.color
        }20; color: ${this.selectedProject.color}; border-color: ${
        this.selectedProject.color
      }80;">
          <span class="project-color-dot" style="background-color: ${
            this.selectedProject.color
          };"></span>
          ${this.escapeHtml(this.selectedProject.name)}
          <span class="remove-project" data-action="remove-project">&times;</span>
        </span>
      `;
      addProjectBtn.classList.add("project-selected");
    }
  }

  clearSelectedProject() {
    this.selectedProject = null;
    const addProjectBtn = document.getElementById("addProjectBtn");
    addProjectBtn.innerHTML = "+ Add to a project";
    addProjectBtn.classList.remove("project-selected");
  }

  handleProjectInput(e) {
    const input = e.target.value;
    this.updateAutocomplete(input);
    this.autocompleteIndex = -1;

    const colorInput = document.getElementById("projectColor");
    const isNewProject = !this.projects.some(
      (p) => p.name.toLowerCase() === input.toLowerCase()
    );
    colorInput.style.display = isNewProject && input ? "block" : "none";
  }

  handleProjectKeydown(e) {
    const autocomplete = document.getElementById("projectAutocomplete");
    const items = autocomplete.querySelectorAll(".autocomplete-item");

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.autocompleteIndex = Math.min(
        this.autocompleteIndex + 1,
        items.length - 1
      );
      this.highlightAutocompleteItem();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.autocompleteIndex = Math.max(this.autocompleteIndex - 1, -1);
      this.highlightAutocompleteItem();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (this.autocompleteIndex >= 0 && items[this.autocompleteIndex]) {
        this.selectAutocompleteItem(items[this.autocompleteIndex]);
      } else {
        this.confirmProject();
      }
    } else if (e.key === "Escape") {
      this.hideProjectInput();
    }
  }

  handleAutocompleteClick(e) {
    if (e.target.classList.contains("autocomplete-item")) {
      this.selectAutocompleteItem(e.target);
    }
  }

  selectAutocompleteItem(item) {
    const projectInput = document.getElementById("projectInput");
    const projectName =
      item.dataset.project || item.textContent.replace("+ ", "");

    projectInput.value = projectName;
    this.handleProjectInput({ target: projectInput }); // Trigger update for color picker
    this.confirmProject();
  }

  updateAutocomplete(input) {
    const autocomplete = document.getElementById("projectAutocomplete");
    const filteredProjects = this.projects.filter((project) =>
      project.name.toLowerCase().includes(input.toLowerCase())
    );

    let html = "";

    // Show existing projects that match
    filteredProjects.forEach((project) => {
      html += `<div class="autocomplete-item" data-project="${this.escapeHtml(
        project.name
      )}">${this.escapeHtml(project.name)}</div>`;
    });

    // Show "Create new" option if input doesn't exactly match any existing project
    if (
      input &&
      !this.projects.some((p) => p.name.toLowerCase() === input.toLowerCase())
    ) {
      html += `<div class="autocomplete-item create-new" data-project="${this.escapeHtml(
        input
      )}">Create "${this.escapeHtml(input)}"</div>`;
    }

    autocomplete.innerHTML = html;

    if (html) {
      autocomplete.classList.add("show");
    } else {
      autocomplete.classList.remove("show");
    }
  }

  highlightAutocompleteItem() {
    const items = document.querySelectorAll(".autocomplete-item");
    items.forEach((item) => item.classList.remove("highlighted"));

    if (this.autocompleteIndex >= 0 && items[this.autocompleteIndex]) {
      items[this.autocompleteIndex].classList.add("highlighted");
    }
  }

  async deleteNote(noteId) {
    if (confirm("Are you sure you want to delete this note?")) {
      this.notes = this.notes.filter((note) => note.id !== noteId);
      await this.saveData();
      this.renderNotes();
      this.renderProjects();
      this.updateProjectFilter();
      this.showNotification("Note deleted successfully!");
    }
  }

  editNote(noteId) {
    const note = this.notes.find((n) => n.id === noteId);
    if (!note) return;

    this.currentEditingNote = note;
    const editNoteText = document.getElementById("editNoteText");
    this.setEditorContent(editNoteText, note.content);
    document.getElementById("editNoteProjects").value =
      note.projects?.join(", ") ?? "";

    document.getElementById("editModal").classList.add("active");

    // Focus the editor after modal is shown
    setTimeout(() => {
      editNoteText.focus();
      this.currentEditor = editNoteText;
    }, 100);
  }

  async updateNote() {
    if (!this.currentEditingNote) return;

    const editNoteText = document.getElementById("editNoteText");
    const newContent = this.getEditorContent(editNoteText);
    const newContentText = this.stripHtml(newContent).trim();
    const newProjectsText = document
      .getElementById("editNoteProjects")
      .value.trim();

    if (!newContentText) {
      alert("Please enter note content");
      return;
    }

    const newProjects = newProjectsText
      ? newProjectsText
          .split(",")
          .map((project) => project.trim())
          .filter((project) => project)
      : [];

    const newProjectObjects = newProjects.map((name) => {
      const existing = this.projects.find((p) => p.name === name);
      return existing || { name, color: getRandomColor() };
    });

    // Update the note
    const noteIndex = this.notes.findIndex(
      (n) => n.id === this.currentEditingNote.id
    );
    if (noteIndex !== -1) {
      this.notes[noteIndex].content = newContent; // Store rich HTML content
      this.notes[noteIndex].projects = newProjects;
      this.notes[noteIndex].updatedAt = new Date().toISOString();
    }

    this.updateProjectsList(newProjectObjects);
    await this.saveData();

    this.closeModal();
    this.renderNotes();
    this.renderProjects();
    this.updateProjectFilter();

    this.showNotification("Note updated successfully!");
  }

  closeModal() {
    document.getElementById("editModal").classList.remove("active");
    this.currentEditingNote = null;
  }

  // Project Management
  updateProjectsList(newProjectObjects) {
    newProjectObjects.forEach((projectObj) => {
      if (!this.projects.some((p) => p.name === projectObj.name)) {
        this.projects.push(projectObj);
      }
    });

    // Clean up unused projects
    const allNoteProjects = new Set(
      [].concat.apply(
        [],
        this.notes.map((note) => note.projects)
      )
    );
    this.projects = this.projects.filter((project) =>
      allNoteProjects.has(project.name)
    );
  }

  async deleteProject(projectName) {
    if (
      confirm(
        `Are you sure you want to remove the project "${projectName}" from all notes?`
      )
    ) {
      // Remove project from all notes
      this.notes.forEach((note) => {
        note.projects = note.projects.filter(
          (project) => project !== projectName
        );
        note.updatedAt = new Date().toISOString();
      });

      // Remove from projects list
      this.projects = this.projects.filter(
        (project) => project.name !== projectName
      );

      await this.saveData();
      this.renderNotes();
      this.renderProjects();
      this.updateProjectFilter();

      this.showNotification(`Project "${projectName}" removed successfully!`);
    }
  }

  // Rendering
  renderNotes() {
    const notesList = document.getElementById("notesList");
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const selectedProject = document.getElementById("projectFilter").value;

    let filteredNotes = this.notes;

    // Apply search filter
    if (searchTerm) {
      filteredNotes = filteredNotes.filter((note) => {
        const plainTextContent = this.stripHtml(note.content).toLowerCase();
        return (
          plainTextContent.includes(searchTerm) ||
          note.projects.some((project) =>
            project.toLowerCase().includes(searchTerm)
          )
        );
      });
    }

    // Apply project filter
    if (selectedProject) {
      filteredNotes = filteredNotes.filter((note) =>
        note.projects.includes(selectedProject)
      );
    }

    if (filteredNotes.length === 0) {
      notesList.innerHTML = `
        <div class="empty-state">
          <p>${
            this.notes.length === 0
              ? "No notes yet. Create your first note above!"
              : "No notes match your search criteria."
          }</p>
        </div>
      `;
      return;
    }

    notesList.innerHTML = filteredNotes
      .map((note) => {
        const project =
          note.projects?.length > 0
            ? this.projects.find((p) => p.name === note.projects[0])
            : null;
        return `
      <div class="note-item" data-id="${note.id}">
        <div class="note-content">${this.renderNoteContent(note.content)}</div>
        <div class="note-footer">
          <div class="note-project" ${
            project
              ? `style="background-color: ${project.color}20; border-color: ${project.color}80;"`
              : ""
          }>
            ${
              project
                ? `<span class="project-color-dot" style="background-color: ${project.color};"></span>`
                : ""
            }
            ${
              note.projects?.length > 0
                ? this.escapeHtml(note.projects[0])
                : "No project"
            }
          </div>
          <div class="note-actions">
            <button class="edit-btn" data-id="edit-${
              note.id
            }" title="Edit note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18,2 3,3v0l-9.5,9.5 -3,3h-3v-3l3,-3L18,2z"></path>
                <path d="m15,5 3,3"></path>
              </svg>
            </button>
            <button class="delete-btn" data-id="delete-${
              note.id
            }" title="Delete note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
      })
      .join("");
  }

  renderProjects() {
    const projectsList = document.getElementById("projectsList");

    if (this.projects.length === 0) {
      projectsList.innerHTML = `
        <div class="empty-state">
          <p>No projects yet. Projects will appear here when you add them to your notes.</p>
        </div>
      `;
      return;
    }

    // Sort projects by usage count
    const projectCounts = {};
    this.notes.forEach((note) => {
      note.projects?.forEach((projectName) => {
        projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
      });
    });

    const sortedProjects = [...this.projects].sort(
      (a, b) => (projectCounts[b.name] || 0) - (projectCounts[a.name] || 0)
    );

    projectsList.innerHTML = sortedProjects
      .map(
        (project) => `
      <div class="project-card" data-project="${this.escapeHtml(
        project.name
      )}" style="border-left-color: ${project.color};">
        <div class="project-content">
          <div class="project-name">${this.escapeHtml(project.name)}</div>
          <div class="project-stats">${
            projectCounts[project.name] === 1
              ? "1 note"
              : `${projectCounts[project.name] || 0} notes`
          }</div>
        </div>
        <div class="project-actions">
          <button class="delete-btn" data-project="${this.escapeHtml(
            project.name
          )}" title="Delete project">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  updateProjectFilter() {
    const projectFilter = document.getElementById("projectFilter");
    const currentVal = projectFilter.value;

    projectFilter.innerHTML = `
      <option value="">All projects</option>
      ${this.projects
        .map(
          (project) =>
            `<option value="${this.escapeHtml(project.name)}">${this.escapeHtml(
              project.name
            )}</option>`
        )
        .join("")}
    `;
    projectFilter.value = currentVal;
  }

  // Safely render note content for display
  renderNoteContent(content) {
    if (!content) return "";

    // If it's plain text (legacy notes), escape and wrap in paragraphs
    if (!content.includes("<") && !content.includes(">")) {
      const lines = content.split("\n").filter((line) => line.trim());
      if (lines.length > 1) {
        return lines.map((line) => `<p>${this.escapeHtml(line)}</p>`).join("");
      } else if (lines.length === 1) {
        return `<p>${this.escapeHtml(lines[0])}</p>`;
      }
      return "";
    }

    // Already HTML content - return as is (it should be safe since we generated it)
    // Make sure links open in new tabs for security
    return content.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  }

  filterNotes() {
    this.renderNotes();
    this.updateClearButtonVisibility();
  }

  // Utility Functions
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }

  showNotification(message) {
    // Create a simple notification
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4285f4;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation keyframes
    if (!document.getElementById("notificationStyles")) {
      const style = document.createElement("style");
      style.id = "notificationStyles";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new NotesManager();
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
