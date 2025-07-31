// Notes Extension - Main JavaScript File

class NotesManager {
  constructor() {
    this.notes = [];
    this.projects = [];
    this.currentEditingNote = null;
    this.selectedProject = null;
    this.autocompleteIndex = -1;
    this.currentView = "add"; // 'add' or 'list'

    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.updateProjectFilter();

    // Start in add note view
    this.showAddNoteView();

    // Only render projects initially
    this.renderProjects();
  }

  // Data Management
  async loadData() {
    const result = await chrome.storage.local.get(["notes", "projects"]);
    this.notes = result.notes || [];
    this.projects = result.projects || [];
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
    document.getElementById("noteInput").addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        this.saveNote();
      }
    });

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
    if (searchInput)
      searchInput.addEventListener("input", () => this.filterNotes());
    if (projectFilter)
      projectFilter.addEventListener("change", () => this.filterNotes());

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

    // Projects Management
    document
      .getElementById("refreshProjects")
      .addEventListener("click", () => this.renderProjects());

    // Event delegation for dynamically created note buttons
    document.getElementById("notesList").addEventListener("click", (e) => {
      if (e.target.matches('.btn[data-id^="edit-"]')) {
        const noteId = parseInt(e.target.dataset.id.replace("edit-", ""));
        this.editNote(noteId);
      } else if (e.target.matches('.btn[data-id^="delete-"]')) {
        const noteId = parseInt(e.target.dataset.id.replace("delete-", ""));
        this.deleteNote(noteId);
      }
    });

    // Event delegation for project delete buttons
    document.getElementById("projectsList").addEventListener("click", (e) => {
      if (e.target.matches(".btn[data-project]")) {
        const projectName = e.target.dataset.project;
        this.deleteProject(projectName);
      }
    });

    // Close modal when clicking outside
    document.getElementById("editModal").addEventListener("click", (e) => {
      if (e.target.id === "editModal") {
        this.closeModal();
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

    // Focus on textarea
    setTimeout(() => {
      document.getElementById("noteInput").focus();
    }, 100);
  }

  showNotesListView() {
    document
      .querySelectorAll(".view")
      .forEach((view) => view.classList.remove("active"));
    document.getElementById("notesListView").classList.add("active");
    this.currentView = "list";
    this.renderNotes();
  }

  goToNewNoteScreen() {
    this.switchTab("notes");
    this.showAddNoteView();
  }

  // Note Management
  async saveNote() {
    const noteText = document.getElementById("noteInput").value.trim();

    if (!noteText) {
      alert("Please enter a note");
      return;
    }

    const projects = this.selectedProject ? [this.selectedProject] : [];

    const note = {
      id: Date.now(),
      content: noteText,
      projects: projects,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.notes.unshift(note);
    this.updateProjectsList(projects);

    await this.saveData();

    // Clear form
    document.getElementById("noteInput").value = "";
    this.clearSelectedProject();

    this.renderNotes();
    this.updateProjectFilter();

    // Show success feedback and switch to list view
    this.showNotification("Note saved successfully!");
    this.showNotesListView();
  }

  // Project Input Management
  showProjectInput() {
    const projectSection = document.getElementById("projectInputSection");
    const projectInput = document.getElementById("projectInput");

    projectSection.style.display = "block";
    projectInput.focus();
    // this.updateAutocomplete('');
  }

  hideProjectInput() {
    const projectSection = document.getElementById("projectInputSection");
    const projectInput = document.getElementById("projectInput");
    const autocomplete = document.getElementById("projectAutocomplete");

    projectSection.style.display = "none";
    projectInput.value = "";
    autocomplete.classList.remove("show");
    this.autocompleteIndex = -1;
  }

  confirmProject() {
    const projectInput = document.getElementById("projectInput");
    const projectName = projectInput.value.trim();

    if (projectName) {
      this.selectedProject = projectName;
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
        <span class="selected-project">
          ${this.escapeHtml(this.selectedProject)}
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
    this.confirmProject();
  }

  updateAutocomplete(input) {
    const autocomplete = document.getElementById("projectAutocomplete");
    const filteredProjects = this.projects.filter((project) =>
      project.toLowerCase().includes(input.toLowerCase())
    );

    let html = "";

    // Show existing projects that match
    filteredProjects.forEach((project) => {
      html += `<div class="autocomplete-item" data-project="${this.escapeHtml(
        project
      )}">${this.escapeHtml(project)}</div>`;
    });

    // Show "Create new" option if input doesn't exactly match any existing project
    if (input && !this.projects.includes(input)) {
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
    document.getElementById("editNoteText").value = note.content;
    document.getElementById("editNoteProjects").value =
      note.projects?.join(", ") ?? "";

    document.getElementById("editModal").classList.add("active");
  }

  async updateNote() {
    if (!this.currentEditingNote) return;

    const newContent = document.getElementById("editNoteText").value.trim();
    const newProjectsText = document
      .getElementById("editNoteProjects")
      .value.trim();

    if (!newContent) {
      alert("Please enter note content");
      return;
    }

    const newProjects = newProjectsText
      ? newProjectsText
          .split(",")
          .map((project) => project.trim())
          .filter((project) => project)
      : [];

    // Update the note
    const noteIndex = this.notes.findIndex(
      (n) => n.id === this.currentEditingNote.id
    );
    if (noteIndex !== -1) {
      this.notes[noteIndex].content = newContent;
      this.notes[noteIndex].projects = newProjects;
      this.notes[noteIndex].updatedAt = new Date().toISOString();
    }

    this.updateProjectsList(newProjects);
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
  updateProjectsList(noteProjects) {
    noteProjects.forEach((project) => {
      if (!this.projects.includes(project)) {
        this.projects.push(project);
      }
    });

    // Clean up unused projects
    this.projects = this.projects.filter((project) =>
      this.notes.some((note) => note.projects.includes(project))
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
        (project) => project !== projectName
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
      filteredNotes = filteredNotes.filter(
        (note) =>
          note.content.toLowerCase().includes(searchTerm) ||
          note.projects.some((project) =>
            project.toLowerCase().includes(searchTerm)
          )
      );
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
      .map(
        (note) => `
      <div class="note-item">
        <div class="note-content">${this.escapeHtml(note.content)}</div>
        ${
          note.projects?.length > 0
            ? `
          <div class="note-projects">
            ${note.projects
              .map(
                (project) =>
                  `<span class="project">${this.escapeHtml(project)}</span>`
              )
              .join("")}
          </div>
        `
            : ""
        }
        <div class="note-meta">
          <span class="note-date">${this.formatDate(note.createdAt)}</span>
          <div class="note-actions">
            <button class="btn btn-secondary" data-id="edit-${
              note.id
            }">Edit</button>
            <button class="btn btn-danger" data-id="delete-${
              note.id
            }">Delete</button>
          </div>
        </div>
      </div>
    `
      )
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
      note.projects?.forEach((project) => {
        projectCounts[project] = (projectCounts[project] || 0) + 1;
      });
    });

    const sortedProjects = this.projects.sort(
      (a, b) => (projectCounts[b] || 0) - (projectCounts[a] || 0)
    );

    projectsList.innerHTML = sortedProjects
      .map(
        (project) => `
      <div class="project-item">
        <div class="project-info">
          <span class="project-name">${this.escapeHtml(project)}</span>
          <span class="project-count">${
            projectCounts[project] || 0
          } notes</span>
        </div>
        <button class="btn btn-danger" data-project="${this.escapeHtml(
          project
        )}">Delete</button>
      </div>
    `
      )
      .join("");
  }

  updateProjectFilter() {
    const projectFilter = document.getElementById("projectFilter");
    const currentValue = projectFilter.value;

    projectFilter.innerHTML = '<option value="">All projects</option>';

    this.projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project;
      option.textContent = project;
      if (project === currentValue) {
        option.selected = true;
      }
      projectFilter.appendChild(option);
    });
  }

  filterNotes() {
    if (this.currentView === "list") {
      this.renderNotes();
    }
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

// Initialize the notes manager when the popup loads
let notesManager;
document.addEventListener("DOMContentLoaded", () => {
  notesManager = new NotesManager();
});
