// ==================== STATE MANAGEMENT ====================
let tasks = [];
let notes = [];
let folders = ['general', 'personal', 'work'];
let currentFilter = 'all';
let currentSort = 'date-desc';
let currentMode = 'task';
let editingTaskId = null;
let editingNoteId = null;
let currentNotesView = 'grid';
let currentNotesFilter = { folder: 'all', tag: 'all', sort: 'modified-desc' };
let currentTextColor = '#ffffff';
let currentHighlightColor = '#ffff00';

// Image Editor State
let currentImage = null;
let imageCanvas = null;
let imageCtx = null;
let originalImage = null;
let cropData = null;
let imageFilters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    flipH: false,
    flipV: false
};

// ==================== DOM ELEMENTS ====================
// Mode Tabs
const modeTabs = document.querySelectorAll('.mode-tab');
const modeIndicator = document.querySelector('.mode-indicator');
const taskSection = document.getElementById('task-section');
const notesSection = document.getElementById('notes-section');

// Task Elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const prioritySelect = document.getElementById('priority-select');
const categoryInput = document.getElementById('category-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterTabs = document.querySelectorAll('.filter-tab');
const sortSelect = document.getElementById('sort-select');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const themeToggle = document.getElementById('theme-toggle');
const editModal = document.getElementById('edit-modal');
const editTaskInput = document.getElementById('edit-task-input');
const editDueDateInput = document.getElementById('edit-due-date');
const editPrioritySelect = document.getElementById('edit-priority');
const editCategoryInput = document.getElementById('edit-category');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const celebrationOverlay = document.getElementById('celebration-overlay');

// Stats elements
const totalTasksEl = document.getElementById('total-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const allCountEl = document.getElementById('all-count');
const activeCountEl = document.getElementById('active-count');
const completedCountEl = document.getElementById('completed-count');

// Notes Elements
const addNoteBtn = document.getElementById('add-note-btn');
const notesGrid = document.getElementById('notes-grid');
const pinnedNotesGrid = document.getElementById('pinned-notes-grid');
const pinnedNotesSection = document.getElementById('pinned-notes-section');
const notesEmptyState = document.getElementById('notes-empty-state');
const notesSearchInput = document.getElementById('notes-search-input');
const notesFolderFilter = document.getElementById('notes-folder-filter');
const notesTagFilter = document.getElementById('notes-tag-filter');
const notesSort = document.getElementById('notes-sort');
const viewBtns = document.querySelectorAll('.view-btn');

// Note Editor Elements
const noteEditorModal = document.getElementById('note-editor-modal');
const noteTitleInput = document.getElementById('note-title-input');
const noteContentEditor = document.getElementById('note-content-editor');
const pinNoteBtn = document.getElementById('pin-note-btn');
const lockNoteBtn = document.getElementById('lock-note-btn');
const closeNoteBtn = document.getElementById('close-note-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const deleteNoteBtn = document.getElementById('delete-note-btn');
const noteFolderSelect = document.getElementById('note-folder-select');
const addFolderBtn = document.getElementById('add-folder-btn');
const noteTagsInput = document.getElementById('note-tags-input');
const noteReminderInput = document.getElementById('note-reminder-input');
const noteLastModified = document.getElementById('note-last-modified');
const colorOptions = document.querySelectorAll('.color-option');
const formatBtns = document.querySelectorAll('.format-btn');
const fontSizeSelect = document.getElementById('font-size-select');
const textColorPicker = document.getElementById('text-color-picker');
const highlightColorPicker = document.getElementById('highlight-color-picker');
const insertLinkBtn = document.getElementById('insert-link-btn');
const imageUploadInput = document.getElementById('image-upload-input');
const voiceInputBtn = document.getElementById('voice-input-btn');
const toggleChecklistBtn = document.getElementById('toggle-checklist-btn');

// Image Editor Elements
const imageEditorModal = document.getElementById('image-editor-modal');
const closeImageEditorBtn = document.getElementById('close-image-editor-btn');
const cropBtn = document.getElementById('crop-btn');
const resizeBtn = document.getElementById('resize-btn');
const rotateBtn = document.getElementById('rotate-btn');
const flipHBtn = document.getElementById('flip-h-btn');
const flipVBtn = document.getElementById('flip-v-btn');
const brightnessSlider = document.getElementById('brightness-slider');
const contrastSlider = document.getElementById('contrast-slider');
const saturationSlider = document.getElementById('saturation-slider');
const brightnessValue = document.getElementById('brightness-value');
const contrastValue = document.getElementById('contrast-value');
const saturationValue = document.getElementById('saturation-value');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const cropControls = document.getElementById('crop-controls');
const resizeControls = document.getElementById('resize-controls');
const aspectRatioSelect = document.getElementById('aspect-ratio-select');
const resizeWidthInput = document.getElementById('resize-width');
const resizeHeightInput = document.getElementById('resize-height');
const lockAspectBtn = document.getElementById('lock-aspect-btn');
const insertImageBtn = document.getElementById('insert-image-btn');
const cancelImageBtn = document.getElementById('cancel-image-btn');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    loadNotesFromStorage();
    loadThemeFromStorage();
    updateFilterIndicator();
    updateModeIndicator();
    renderTasks();
    updateStats();
    renderNotes();
    updateFolderFilters();
    updateTagFilters();
    initializeImageEditor();
    
    // Set default text color based on theme
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        currentTextColor = '#ffffff';
        textColorPicker.value = '#ffffff';
    } else {
        currentTextColor = '#1a202c';
        textColorPicker.value = '#1a202c';
    }
});

// ==================== LOCAL STORAGE ====================
function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

function saveNotesToStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadNotesFromStorage() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    }
    const storedFolders = localStorage.getItem('folders');
    if (storedFolders) {
        folders = JSON.parse(storedFolders);
    }
}

function saveThemeToStorage(theme) {
    localStorage.setItem('theme', theme);
}

function loadThemeFromStorage() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// ==================== THEME TOGGLE ====================
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    saveThemeToStorage(newTheme);
    updateThemeIcon(newTheme);
    updateEmptyStateImage();
    
    // Update text color based on theme
    if (newTheme === 'dark') {
        currentTextColor = '#ffffff';
        textColorPicker.value = '#ffffff';
    } else {
        currentTextColor = '#1a202c';
        textColorPicker.value = '#1a202c';
    }
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

function updateEmptyStateImage() {
    const theme = document.documentElement.getAttribute('data-theme');
    const emptyImages = document.querySelectorAll('.empty-image');
    emptyImages.forEach(img => {
        if (theme === 'dark') {
            img.src = 'images/empty-state-dark.jpeg';
        } else {
            img.src = 'images/empty-state-light.jpeg';
        }
    });
}

// ==================== MODE SWITCHING ====================
modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMode = tab.dataset.mode;
        
        if (currentMode === 'task') {
            taskSection.classList.add('active');
            notesSection.classList.remove('active');
        } else {
            taskSection.classList.remove('active');
            notesSection.classList.add('active');
        }
        
        updateModeIndicator();
    });
});

function updateModeIndicator() {
    const activeTab = document.querySelector('.mode-tab.active');
    if (activeTab && modeIndicator) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = activeTab.parentElement.getBoundingClientRect();
        const left = tabRect.left - containerRect.left;
        
        modeIndicator.style.width = `${tabRect.width}px`;
        modeIndicator.style.left = `${left}px`;
    }
}

window.addEventListener('resize', updateModeIndicator);

// ==================== ADD TASK ====================
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        taskInput.focus();
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: prioritySelect.value,
        category: categoryInput.value.trim(),
        dueDate: dueDateInput.value,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasksToStorage();
    
    // Reset inputs
    taskInput.value = '';
    categoryInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'medium';
    
    taskInput.focus();
    renderTasks();
    updateStats();
}

// ==================== RENDER TASKS ====================
function renderTasks() {
    // Filter tasks
    let filteredTasks = filterTasks(tasks);
    
    // Search tasks
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.text.toLowerCase().includes(searchTerm) ||
            (task.category && task.category.toLowerCase().includes(searchTerm))
        );
    }
    
    // Sort tasks
    filteredTasks = sortTasks(filteredTasks);
    
    // Clear list
    taskList.innerHTML = '';
    
    // Show/hide empty state
    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        updateEmptyStateImage();
    } else {
        emptyState.classList.remove('show');
    }
    
    // Render each task
    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority}`;
    li.dataset.taskId = task.id;
    
    if (task.completed) {
        li.classList.add('completed');
    }
    
    // Checkbox
    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.completed ? 'checked' : ''}`;
    checkbox.innerHTML = task.completed ? '<i class="fas fa-check"></i>' : '';
    checkbox.addEventListener('click', () => toggleTaskComplete(task.id));
    
    // Task info
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    taskContent.textContent = task.text;
    
    const taskMeta = document.createElement('div');
    taskMeta.className = 'task-meta';
    
    // Due date
    if (task.dueDate) {
        const dueDate = document.createElement('span');
        dueDate.className = 'task-due-date';
        const date = new Date(task.dueDate);
        const now = new Date();
        
        if (date < now && !task.completed) {
            dueDate.classList.add('overdue');
        }
        
        dueDate.innerHTML = `<i class="fas fa-clock"></i> ${formatDate(task.dueDate)}`;
        taskMeta.appendChild(dueDate);
    }
    
    // Category
    if (task.category) {
        const category = document.createElement('span');
        category.className = 'task-category';
        category.innerHTML = `<i class="fas fa-tag"></i> ${task.category}`;
        taskMeta.appendChild(category);
    }
    
    // Priority badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `task-priority-badge priority-${task.priority}`;
    priorityBadge.innerHTML = `<i class="fas fa-flag"></i> ${capitalizeFirst(task.priority)}`;
    taskMeta.appendChild(priorityBadge);
    
    taskInfo.appendChild(taskContent);
    taskInfo.appendChild(taskMeta);
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'task-btn edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => openEditModal(task.id));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    li.appendChild(checkbox);
    li.appendChild(taskInfo);
    li.appendChild(actions);
    
    return li;
}

// ==================== TASK ACTIONS ====================
function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateStats();
        checkAllCompleted();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.classList.add('removing');
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== taskId);
                saveTasksToStorage();
                renderTasks();
                updateStats();
            }, 400);
        }
    }
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        editingTaskId = taskId;
        editTaskInput.value = task.text;
        editDueDateInput.value = task.dueDate || '';
        editPrioritySelect.value = task.priority;
        editCategoryInput.value = task.category || '';
        editModal.classList.add('show');
        editTaskInput.focus();
    }
}

function closeEditModal() {
    editModal.classList.remove('show');
    editingTaskId = null;
    editTaskInput.value = '';
    editDueDateInput.value = '';
    editPrioritySelect.value = 'medium';
    editCategoryInput.value = '';
}

saveEditBtn.addEventListener('click', () => {
    if (editingTaskId !== null) {
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.text = editTaskInput.value.trim();
            task.dueDate = editDueDateInput.value;
            task.priority = editPrioritySelect.value;
            task.category = editCategoryInput.value.trim();
            
            saveTasksToStorage();
            renderTasks();
            updateStats();
            closeEditModal();
        }
    }
});

cancelEditBtn.addEventListener('click', closeEditModal);

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEditModal();
        closeNoteEditor();
        closeImageEditor();
    }
});

// Close modal on outside click
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// ==================== FILTER TASKS ====================
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        updateFilterIndicator();
        renderTasks();
    });
});

function filterTasks(taskList) {
    switch (currentFilter) {
        case 'active':
            return taskList.filter(task => !task.completed);
        case 'completed':
            return taskList.filter(task => task.completed);
        default:
            return taskList;
    }
}

function updateFilterIndicator() {
    const activeTab = document.querySelector('.filter-tab.active');
    const indicator = document.querySelector('.tab-indicator');
    const tabsContainer = document.querySelector('.filter-tabs');
    
    if (activeTab && indicator && tabsContainer) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        const left = tabRect.left - containerRect.left;
        
        indicator.style.width = `${tabRect.width}px`;
        indicator.style.left = `${left}px`;
    }
}

// Update indicator on window resize
window.addEventListener('resize', updateFilterIndicator);

// ==================== SEARCH ====================
searchInput.addEventListener('input', renderTasks);

// ==================== SORT TASKS ====================
sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    renderTasks();
});

function sortTasks(taskList) {
    const sorted = [...taskList];
    
    switch (currentSort) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'alpha-asc':
            return sorted.sort((a, b) => a.text.localeCompare(b.text));
        case 'alpha-desc':
            return sorted.sort((a, b) => b.text.localeCompare(a.text));
        case 'due-date':
            return sorted.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        default:
            return sorted;
    }
}

// ==================== CLEAR TASKS ====================
clearCompletedBtn.addEventListener('click', () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToStorage();
        renderTasks();
        updateStats();
    }
});

clearAllBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    
    if (confirm(`Are you sure you want to delete all ${tasks.length} task(s)? This action cannot be undone.`)) {
        tasks = [];
        saveTasksToStorage();
        renderTasks();
        updateStats();
    }
});

// ==================== UPDATE STATS ====================
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    pendingTasksEl.textContent = pending;
    completedTasksEl.textContent = completed;
    
    allCountEl.textContent = total;
    activeCountEl.textContent = pending;
    completedCountEl.textContent = completed;
    
    // Update button states
    clearCompletedBtn.disabled = completed === 0;
    clearAllBtn.disabled = total === 0;
}

// ==================== CELEBRATION ====================
function checkAllCompleted() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    if (total > 0 && total === completed) {
        showCelebration();
    }
}

function showCelebration() {
    celebrationOverlay.classList.add('show');
    setTimeout(() => {
        celebrationOverlay.classList.remove('show');
    }, 3000);
}

celebrationOverlay.addEventListener('click', () => {
    celebrationOverlay.classList.remove('show');
});

// ==================== NOTES SECTION ====================

// View Toggle
viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentNotesView = btn.dataset.view;
        
        if (currentNotesView === 'list') {
            notesGrid.classList.add('list-view');
            pinnedNotesGrid.classList.add('list-view');
        } else {
            notesGrid.classList.remove('list-view');
            pinnedNotesGrid.classList.remove('list-view');
        }
    });
});

// Add Note
addNoteBtn.addEventListener('click', () => {
    openNoteEditor();
});

// Search Notes
notesSearchInput.addEventListener('input', renderNotes);

// Filter Notes
notesFolderFilter.addEventListener('change', () => {
    currentNotesFilter.folder = notesFolderFilter.value;
    renderNotes();
});

notesTagFilter.addEventListener('change', () => {
    currentNotesFilter.tag = notesTagFilter.value;
    renderNotes();
});

notesSort.addEventListener('change', () => {
    currentNotesFilter.sort = notesSort.value;
    renderNotes();
});

function renderNotes() {
    let filteredNotes = [...notes];
    
    // Search
    const searchTerm = notesSearchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredNotes = filteredNotes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
    }
    
    // Filter by folder
    if (currentNotesFilter.folder !== 'all') {
        filteredNotes = filteredNotes.filter(note => note.folder === currentNotesFilter.folder);
    }
    
    // Filter by tag
    if (currentNotesFilter.tag !== 'all') {
        filteredNotes = filteredNotes.filter(note => 
            note.tags && note.tags.includes(currentNotesFilter.tag)
        );
    }
    
    // Sort
    filteredNotes = sortNotes(filteredNotes);
    
    // Separate pinned and unpinned
    const pinnedNotes = filteredNotes.filter(note => note.pinned);
    const unpinnedNotes = filteredNotes.filter(note => !note.pinned);
    
    // Clear grids
    notesGrid.innerHTML = '';
    pinnedNotesGrid.innerHTML = '';
    
    // Show/hide pinned section
    if (pinnedNotes.length > 0) {
        pinnedNotesSection.style.display = 'block';
        pinnedNotes.forEach(note => {
            const noteCard = createNoteCard(note);
            pinnedNotesGrid.appendChild(noteCard);
        });
    } else {
        pinnedNotesSection.style.display = 'none';
    }
    
    // Render unpinned notes
    if (unpinnedNotes.length === 0 && pinnedNotes.length === 0) {
        notesEmptyState.classList.add('show');
        updateEmptyStateImage();
    } else {
        notesEmptyState.classList.remove('show');
        unpinnedNotes.forEach(note => {
            const noteCard = createNoteCard(note);
            notesGrid.appendChild(noteCard);
        });
    }
}

function createNoteCard(note) {
    const card = document.createElement('div');
    card.className = `note-card ${note.color ? 'color-' + note.color : ''}`;
    card.dataset.noteId = note.id;
    
    const header = document.createElement('div');
    header.className = 'note-card-header';
    
    const title = document.createElement('h4');
    title.className = 'note-card-title';
    title.textContent = note.title || 'Untitled Note';
    
    const icons = document.createElement('div');
    icons.className = 'note-card-icons';
    
    if (note.pinned) {
        const pinIcon = document.createElement('button');
        pinIcon.className = 'note-icon pinned';
        pinIcon.innerHTML = '<i class="fas fa-thumbtack"></i>';
        pinIcon.onclick = (e) => {
            e.stopPropagation();
            togglePinNote(note.id);
        };
        icons.appendChild(pinIcon);
    }
    
    if (note.locked) {
        const lockIcon = document.createElement('button');
        lockIcon.className = 'note-icon locked';
        lockIcon.innerHTML = '<i class="fas fa-lock"></i>';
        icons.appendChild(lockIcon);
    }
    
    header.appendChild(title);
    header.appendChild(icons);
    
    const content = document.createElement('div');
    content.className = 'note-card-content';
    content.innerHTML = stripHTML(note.content).substring(0, 150) + (note.content.length > 150 ? '...' : '');
    
    const meta = document.createElement('div');
    meta.className = 'note-card-meta';
    
    if (note.folder) {
        const folder = document.createElement('span');
        folder.className = 'note-folder';
        folder.innerHTML = `<i class="fas fa-folder"></i> ${note.folder}`;
        meta.appendChild(folder);
    }
    
    if (note.tags && note.tags.length > 0) {
        note.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'note-tag';
            tagSpan.innerHTML = `<i class="fas fa-tag"></i> ${tag}`;
            meta.appendChild(tagSpan);
        });
    }
    
    const footer = document.createElement('div');
    footer.className = 'note-card-footer';
    footer.textContent = `Modified: ${formatNoteDate(note.modifiedAt)}`;
    
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(meta);
    card.appendChild(footer);
    
    card.addEventListener('click', () => {
        if (note.locked) {
            const password = prompt('Enter password to unlock note:');
            if (password === note.password) {
                openNoteEditor(note.id);
            } else {
                alert('Incorrect password!');
            }
        } else {
            openNoteEditor(note.id);
        }
    });
    
    return card;
}

function sortNotes(noteList) {
    const sorted = [...noteList];
    
    switch (currentNotesFilter.sort) {
        case 'modified-desc':
            return sorted.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
        case 'created-desc':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'created-asc':
            return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'alpha-asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'alpha-desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        default:
            return sorted;
    }
}

function togglePinNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.pinned = !note.pinned;
        saveNotesToStorage();
        renderNotes();
    }
}

// ==================== NOTE EDITOR ====================
function openNoteEditor(noteId = null) {
    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            editingNoteId = noteId;
            noteTitleInput.value = note.title;
            noteContentEditor.innerHTML = note.content;
            noteFolderSelect.value = note.folder || 'general';
            noteTagsInput.value = note.tags ? note.tags.join(', ') : '';
            noteReminderInput.value = note.reminder || '';
            
            // Update pin button
            if (note.pinned) {
                pinNoteBtn.classList.add('active');
            } else {
                pinNoteBtn.classList.remove('active');
            }
            
            // Update lock button
            if (note.locked) {
                lockNoteBtn.classList.add('active');
            } else {
                lockNoteBtn.classList.remove('active');
            }
            
            // Update color
            colorOptions.forEach(opt => {
                if (opt.dataset.color === (note.color || 'default')) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
            
            noteLastModified.textContent = `Last modified: ${formatNoteDate(note.modifiedAt)}`;
            deleteNoteBtn.style.display = 'flex';
        }
    } else {
        editingNoteId = null;
        noteTitleInput.value = '';
        noteContentEditor.innerHTML = 'Start typing your note...';
        noteFolderSelect.value = 'general';
        noteTagsInput.value = '';
        noteReminderInput.value = '';
        pinNoteBtn.classList.remove('active');
        lockNoteBtn.classList.remove('active');
        colorOptions.forEach(opt => {
            if (opt.dataset.color === 'default') {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        noteLastModified.textContent = 'Created: Just now';
        deleteNoteBtn.style.display = 'none';
    }
    
    noteEditorModal.classList.add('show');
    noteTitleInput.focus();
}

function closeNoteEditor() {
    noteEditorModal.classList.remove('show');
    editingNoteId = null;
}

closeNoteBtn.addEventListener('click', closeNoteEditor);

noteEditorModal.addEventListener('click', (e) => {
    if (e.target === noteEditorModal) {
        closeNoteEditor();
    }
});

// Pin Note
pinNoteBtn.addEventListener('click', () => {
    pinNoteBtn.classList.toggle('active');
});

// Lock Note
lockNoteBtn.addEventListener('click', () => {
    if (lockNoteBtn.classList.contains('active')) {
        lockNoteBtn.classList.remove('active');
    } else {
        const password = prompt('Set a password for this note:');
        if (password && password.trim()) {
            lockNoteBtn.classList.add('active');
            lockNoteBtn.dataset.password = password;
        }
    }
});

// Color Selection
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
    });
});

// Format Toolbar
formatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const command = btn.dataset.command;
        if (command) {
            document.execCommand(command, false, null);
            noteContentEditor.focus();
        }
    });
});

fontSizeSelect.addEventListener('change', () => {
    document.execCommand('fontSize', false, fontSizeSelect.value);
    noteContentEditor.focus();
});

// Text Color Picker - Apply color to new text
textColorPicker.addEventListener('change', () => {
    currentTextColor = textColorPicker.value;
    document.execCommand('foreColor', false, currentTextColor);
    noteContentEditor.focus();
});

// Apply current text color when typing
noteContentEditor.addEventListener('keypress', (e) => {
    // Apply color to new text
    setTimeout(() => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.color = currentTextColor;
            
            // Wrap the newly typed character
            try {
                range.surroundContents(span);
            } catch (err) {
                // If surroundContents fails, use execCommand
                document.execCommand('foreColor', false, currentTextColor);
            }
        }
    }, 0);
});

// Highlight Color Picker
highlightColorPicker.addEventListener('change', () => {
    currentHighlightColor = highlightColorPicker.value;
    document.execCommand('hiliteColor', false, currentHighlightColor);
    noteContentEditor.focus();
});

// Insert Link
insertLinkBtn.addEventListener('click', () => {
    const url = prompt('Enter URL:');
    if (url) {
        document.execCommand('createLink', false, url);
        noteContentEditor.focus();
    }
});

// Image Upload
imageUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentImage = new Image();
            currentImage.onload = () => {
                openImageEditor(currentImage);
            };
            currentImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    // Reset input
    imageUploadInput.value = '';
});

// Voice Input
voiceInputBtn.addEventListener('click', () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const span = document.createElement('span');
            span.style.color = currentTextColor;
            span.textContent = transcript + ' ';
            noteContentEditor.appendChild(span);
            noteContentEditor.focus();
        };
        
        recognition.start();
        voiceInputBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        
        recognition.onend = () => {
            voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        };
    } else {
        alert('Speech recognition is not supported in your browser.');
    }
});

// Checklist Toggle
toggleChecklistBtn.addEventListener('click', () => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '8px';
    checkbox.style.cursor = 'pointer';
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(checkbox);
        range.collapse(false);
        noteContentEditor.focus();
    }
});

// Keyboard Shortcuts
noteContentEditor.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'b':
                e.preventDefault();
                document.execCommand('bold');
                break;
            case 'i':
                e.preventDefault();
                document.execCommand('italic');
                break;
            case 'u':
                e.preventDefault();
                document.execCommand('underline');
                break;
        }
    }
});

// Save Note
saveNoteBtn.addEventListener('click', saveNote);

function saveNote() {
    const title = noteTitleInput.value.trim() || 'Untitled Note';
    const content = noteContentEditor.innerHTML;
    const folder = noteFolderSelect.value;
    const tags = noteTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const reminder = noteReminderInput.value;
    const pinned = pinNoteBtn.classList.contains('active');
    const locked = lockNoteBtn.classList.contains('active');
    const password = locked ? lockNoteBtn.dataset.password : null;
    const color = document.querySelector('.color-option.active')?.dataset.color || 'default';
    
    if (editingNoteId) {
        const note = notes.find(n => n.id === editingNoteId);
        if (note) {
            note.title = title;
            note.content = content;
            note.folder = folder;
            note.tags = tags;
            note.reminder = reminder;
            note.pinned = pinned;
            note.locked = locked;
            note.password = password;
            note.color = color;
            note.modifiedAt = new Date().toISOString();
        }
    } else {
        const note = {
            id: Date.now(),
            title,
            content,
            folder,
            tags,
            reminder,
            pinned,
            locked,
            password,
            color,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString()
        };
        notes.unshift(note);
    }
    
    saveNotesToStorage();
    renderNotes();
    updateFolderFilters();
    updateTagFilters();
    closeNoteEditor();
}

// Delete Note
deleteNoteBtn.addEventListener('click', () => {
    if (editingNoteId && confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== editingNoteId);
        saveNotesToStorage();
        renderNotes();
        updateFolderFilters();
        updateTagFilters();
        closeNoteEditor();
    }
});

// Add Folder
addFolderBtn.addEventListener('click', () => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim() && !folders.includes(folderName.trim().toLowerCase())) {
        folders.push(folderName.trim().toLowerCase());
        localStorage.setItem('folders', JSON.stringify(folders));
        updateFolderFilters();
    }
});

function updateFolderFilters() {
    // Update folder select in editor
    noteFolderSelect.innerHTML = '';
    folders.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder;
        option.textContent = capitalizeFirst(folder);
        noteFolderSelect.appendChild(option);
    });
    
    // Update folder filter
    notesFolderFilter.innerHTML = '<option value="all">All Folders</option>';
    folders.forEach(folder => {
        const option = document.createElement('option');
        option.value = folder;
        option.textContent = capitalizeFirst(folder);
        notesFolderFilter.appendChild(option);
    });
}

function updateTagFilters() {
    const allTags = new Set();
    notes.forEach(note => {
        if (note.tags) {
            note.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    notesTagFilter.innerHTML = '<option value="all">All Tags</option>';
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        notesTagFilter.appendChild(option);
    });
}

// ==================== IMAGE EDITOR ====================
function initializeImageEditor() {
    imageCanvas = document.getElementById('image-canvas');
    imageCtx = imageCanvas.getContext('2d');
}

function openImageEditor(image) {
    originalImage = image;
    currentImage = image;
    
    // Reset filters
    imageFilters = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        flipH: false,
        flipV: false
    };
    
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    brightnessValue.textContent = 100;
    contrastValue.textContent = 100;
    saturationValue.textContent = 100;
    
    // Set canvas size
    imageCanvas.width = image.width;
    imageCanvas.height = image.height;
    
    // Draw image
    drawImage();
    
    // Show crop controls by default
    cropControls.style.display = 'flex';
    resizeControls.style.display = 'none';
    
    imageEditorModal.classList.add('show');
}

function closeImageEditor() {
    imageEditorModal.classList.remove('show');
    currentImage = null;
    originalImage = null;
}

closeImageEditorBtn.addEventListener('click', closeImageEditor);
cancelImageBtn.addEventListener('click', closeImageEditor);

imageEditorModal.addEventListener('click', (e) => {
    if (e.target === imageEditorModal) {
        closeImageEditor();
    }
});

function drawImage() {
    if (!currentImage) return;
    
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    
    imageCtx.save();
    
    // Apply transformations
    imageCtx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
    
    if (imageFilters.flipH) {
        imageCtx.scale(-1, 1);
    }
    
    if (imageFilters.flipV) {
        imageCtx.scale(1, -1);
    }
    
    imageCtx.rotate((imageFilters.rotation * Math.PI) / 180);
    
    // Apply filters
    imageCtx.filter = `brightness(${imageFilters.brightness}%) contrast(${imageFilters.contrast}%) saturate(${imageFilters.saturation}%)`;
    
    imageCtx.drawImage(
        currentImage,
        -currentImage.width / 2,
        -currentImage.height / 2,
        currentImage.width,
        currentImage.height
    );
    
    imageCtx.restore();
}

// Tool Buttons
const editorToolBtns = document.querySelectorAll('.editor-tool-btn');
editorToolBtns.forEach(btn => {
    if (!btn.id.includes('reset')) {
        btn.addEventListener('click', () => {
            editorToolBtns.forEach(b => {
                if (!b.id.includes('reset')) b.classList.remove('active');
            });
            btn.classList.add('active');
            
            if (btn.id === 'crop-btn') {
                cropControls.style.display = 'flex';
                resizeControls.style.display = 'none';
            } else if (btn.id === 'resize-btn') {
                cropControls.style.display = 'none';
                resizeControls.style.display = 'flex';
                resizeWidthInput.value = imageCanvas.width;
                resizeHeightInput.value = imageCanvas.height;
            } else {
                cropControls.style.display = 'none';
                resizeControls.style.display = 'none';
            }
        });
    }
});

// Rotate
rotateBtn.addEventListener('click', () => {
    imageFilters.rotation = (imageFilters.rotation + 90) % 360;
    
    // Swap canvas dimensions
    const temp = imageCanvas.width;
    imageCanvas.width = imageCanvas.height;
    imageCanvas.height = temp;
    
    drawImage();
});

// Flip Horizontal
flipHBtn.addEventListener('click', () => {
    imageFilters.flipH = !imageFilters.flipH;
    drawImage();
});

// Flip Vertical
flipVBtn.addEventListener('click', () => {
    imageFilters.flipV = !imageFilters.flipV;
    drawImage();
});

// Brightness Slider
brightnessSlider.addEventListener('input', () => {
    imageFilters.brightness = brightnessSlider.value;
    brightnessValue.textContent = brightnessSlider.value;
    drawImage();
});

// Contrast Slider
contrastSlider.addEventListener('input', () => {
    imageFilters.contrast = contrastSlider.value;
    contrastValue.textContent = contrastSlider.value;
    drawImage();
});

// Saturation Slider
saturationSlider.addEventListener('input', () => {
    imageFilters.saturation = saturationSlider.value;
    saturationValue.textContent = saturationSlider.value;
    drawImage();
});

// Reset Filters
resetFiltersBtn.addEventListener('click', () => {
    imageFilters = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        flipH: false,
        flipV: false
    };
    
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    brightnessValue.textContent = 100;
    contrastValue.textContent = 100;
    saturationValue.textContent = 100;
    
    // Reset canvas to original dimensions
    imageCanvas.width = originalImage.width;
    imageCanvas.height = originalImage.height;
    currentImage = originalImage;
    
    drawImage();
});

// Resize with locked aspect ratio
let aspectRatioLocked = true;
let aspectRatio = 1;

lockAspectBtn.addEventListener('click', () => {
    aspectRatioLocked = !aspectRatioLocked;
    lockAspectBtn.classList.toggle('active');
    
    if (aspectRatioLocked) {
        aspectRatio = resizeWidthInput.value / resizeHeightInput.value;
    }
});

resizeWidthInput.addEventListener('input', () => {
    if (aspectRatioLocked) {
        resizeHeightInput.value = Math.round(resizeWidthInput.value / aspectRatio);
    }
});

resizeHeightInput.addEventListener('input', () => {
    if (aspectRatioLocked) {
        resizeWidthInput.value = Math.round(resizeHeightInput.value * aspectRatio);
    }
});

// Apply resize when switching away from resize tool
resizeBtn.addEventListener('click', () => {
    const newWidth = parseInt(resizeWidthInput.value);
    const newHeight = parseInt(resizeHeightInput.value);
    
    if (newWidth > 0 && newHeight > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = newWidth;
        tempCanvas.height = newHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(imageCanvas, 0, 0, newWidth, newHeight);
        
        imageCanvas.width = newWidth;
        imageCanvas.height = newHeight;
        
        const resizedImage = new Image();
        resizedImage.onload = () => {
            currentImage = resizedImage;
            drawImage();
        };
        resizedImage.src = tempCanvas.toDataURL();
    }
});

// Aspect Ratio for Crop
aspectRatioSelect.addEventListener('change', () => {
    // This would integrate with a crop library in production
    // For now, it's just a UI element
});

// Insert Image into Note
insertImageBtn.addEventListener('click', () => {
    const imageData = imageCanvas.toDataURL('image/png');
    
    const img = document.createElement('img');
    img.src = imageData;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.margin = '10px 0';
    img.style.borderRadius = '8px';
    
    noteContentEditor.appendChild(img);
    noteContentEditor.focus();
    
    closeImageEditor();
});

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return `Today ${formatTime(date)}`;
    } else if (diffDays === 1) {
        return `Tomorrow ${formatTime(date)}`;
    } else if (diffDays === -1) {
        return `Yesterday ${formatTime(date)}`;
    } else if (diffDays > 1 && diffDays <= 7) {
        return `${diffDays} days from now`;
    } else if (diffDays < -1 && diffDays >= -7) {
        return `${Math.abs(diffDays)} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function formatNoteDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// ==================== INITIAL RENDER ====================
updateEmptyStateImage();