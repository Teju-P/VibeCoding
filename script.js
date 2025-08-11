// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const greetingEl = document.getElementById('greeting');
    const quoteEl = document.getElementById('quote');
    const weatherTempEl = document.getElementById('weather-temp');
    const weatherCityEl = document.getElementById('weather-city');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoListEl = document.getElementById('todo-list');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.dataset.target;

            // If the link doesn't have a target, it's not a content switcher (e.g., Apps dropdown).
            // Let its specific event handler manage it and do nothing here.
            if (!targetId) return;

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show/hide content sections
            contentSections.forEach(section => {
                if (section.id === targetId) {
                    // Dashboard needs a specific flex display, others can be flex column
                    section.style.display = (section.id === 'dashboard-section') ? 'flex' : 'flex';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    // --- Time & Greeting ---
    function showTime() {
        const timeContainer = document.getElementById('time');
        if (!timeContainer) return;

        // 5x7 dot matrix patterns for numbers 0-9
        const DOT_PATTERNS = {
            '0': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
            '1': [0,0,1,0,0, 0,1,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0, 0,1,1,1,0],
            '2': [0,1,1,1,0, 1,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0, 1,0,0,0,0, 1,1,1,1,1],
            '3': [0,1,1,1,0, 1,0,0,0,1, 0,0,1,1,0, 0,0,0,0,1, 0,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
            '4': [1,0,0,0,1, 1,0,0,0,1, 1,0,1,0,1, 1,1,1,1,1, 0,0,1,0,0, 0,0,1,0,0, 0,0,1,0,0],
            '5': [1,1,1,1,1, 1,0,0,0,0, 1,1,1,1,0, 0,0,0,0,1, 0,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
            '6': [0,1,1,1,0, 1,0,0,0,0, 1,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
            '7': [1,1,1,1,1, 0,0,0,0,1, 0,0,0,1,0, 0,0,1,0,0, 0,1,0,0,0, 0,1,0,0,0, 0,1,0,0,0],
            '8': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0],
            '9': [0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,1, 0,0,0,0,1, 0,0,0,0,1, 0,1,1,1,0]
        };

        // Create the clock structure
        timeContainer.innerHTML = `
            <div class="dot-matrix-digit"></div>
            <div class="dot-matrix-digit"></div>
            <div class="dot-matrix-separator"><div class="dot on"></div><div class="dot on"></div></div>
            <div class="dot-matrix-digit"></div>
            <div class="dot-matrix-digit"></div>
            <div class="dot-matrix-separator"><div class="dot on"></div><div class="dot on"></div></div>
            <div class="dot-matrix-digit"></div>
            <div class="dot-matrix-digit"></div>
        `;

        const digitElements = timeContainer.querySelectorAll('.dot-matrix-digit');
        digitElements.forEach(digitEl => {
            for (let i = 0; i < 35; i++) { // 5x7 grid
                const dot = document.createElement('div');
                dot.classList.add('dot');
                digitEl.appendChild(dot);
            }
        });

        function updateDigit(digitEl, number) {
            const pattern = DOT_PATTERNS[number];
            const dots = digitEl.querySelectorAll('.dot');
            if (pattern) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('on', pattern[i] === 1);
                });
            }
        }

        function updateTime() {
            const now = new Date();
            const timeStr = addZero(now.getHours()) + addZero(now.getMinutes()) + addZero(now.getSeconds());

            digitElements.forEach((digitEl, index) => {
                updateDigit(digitEl, timeStr[index]);
            });
        }

        setInterval(updateTime, 1000);
        updateTime(); // Initial call
    }

    function addZero(n) {
        return (parseInt(n, 10) < 10 ? '0' : '') + n;
    }

    function setGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) {
            greetingEl.textContent = 'Good Morning';
        } else if (hour < 18) {
            greetingEl.textContent = 'Good Afternoon';
        } else {
            greetingEl.textContent = 'Good Evening';
        }
    }

    // --- Background & Quote APIs ---
    async function setBackground() {
        try {
            const response = await fetch('https://source.unsplash.com/random/1920x1080/?nature,water,landscape');
            document.body.style.backgroundImage = `url('${response.url}')`;
        } catch (err) {
            console.error("Failed to fetch background image:", err);
            // Fallback background is set in CSS
        }
    }

    async function getQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            quoteEl.textContent = `"${data.content}" - ${data.author}`;
        } catch (err) {
            console.error("Failed to fetch quote:", err);
            quoteEl.textContent = '"The secret of getting ahead is getting started."'; // Fallback
        }
    }

    // --- Weather API ---
    async function getWeather(lat, lon) {
        // IMPORTANT: Get your own free API key from openweathermap.org
        const apiKey = '6d5cec70a44a33209e08fc3ed1bd7b4f'; // <--- PASTE YOUR API KEY HERE
        if (apiKey === 'YOUR_API_KEY_HERE') {
            weatherCityEl.textContent = "API Key Needed";
            return;
        }
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();
            weatherTempEl.textContent = `${Math.round(data.main.temp)}°C`;
            weatherCityEl.textContent = data.name;
        } catch (err) {
            console.error("Failed to fetch weather:", err);
        }
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => getWeather(position.coords.latitude, position.coords.longitude),
            (err) => console.error("Geolocation denied.", err)
        );
    }

    // --- To-Do List ---
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoListEl.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            li.classList.toggle('completed', todo.completed);
            li.addEventListener('click', () => toggleTodo(index));
            todoListEl.appendChild(li);
        });
    }

    function addTodo(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    todoForm.addEventListener('submit', addTodo);
    todoListEl.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const index = e.target.closest('.delete-btn').dataset.index;
            deleteTodo(index);
        }
    });

    // --- Music Section Tab Logic ---
    const musicNavLinks = document.querySelectorAll('.music-nav-link');
    const musicContentPanes = document.querySelectorAll('.music-content');
    const customMusicForm = document.getElementById('custom-music-form');
    const customMusicInput = document.getElementById('custom-music-input');
    const customVideoContainer = document.getElementById('custom-video-container');

    musicNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.musicTarget;

            // Update active link
            musicNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show/hide content panes
            musicContentPanes.forEach(pane => {
                pane.style.display = (pane.id === targetId) ? 'block' : 'none';
            });
        });
    });

    function getYouTubeVideoId(url) {
        let videoId = '';
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
                videoId = urlObj.searchParams.get('v');
            }
        } catch (error) {
            // Fallback for simple regex if URL constructor fails on partial input
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
            const match = url.match(regex);
            if (match) videoId = match[1];
        }
        return videoId;
    }

    customMusicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = customMusicInput.value.trim();
        if (url) {
            const videoId = getYouTubeVideoId(url);
            if (videoId) {
                customVideoContainer.innerHTML = `
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                `;
            } else {
                alert('Could not find a valid YouTube video ID in the URL.');
            }
        }
    });

    // --- Sticky Notes ---
    const notesContainer = document.getElementById('notes-container');
    const addNoteBtn = document.getElementById('add-note-btn');
    let notes = JSON.parse(localStorage.getItem('stickynotes')) || [];
    const noteColors = ['#ffc', '#cfc', '#ccf', '#fcc', '#cff', '#ffcf']; // Yellow, Green, Blue, Red, Cyan, Pink

    function saveNotes() {
        localStorage.setItem('stickynotes', JSON.stringify(notes));
    }

    function createNoteElement(note) {
        const noteEl = document.createElement('div');
        noteEl.classList.add('note');
        noteEl.style.backgroundColor = note.color;

        noteEl.innerHTML = `
            <div class="note-header">
                <div class="color-palette">
                    ${noteColors.map(color => `<div class="color-swatch" style="background-color: ${color};" data-color="${color}"></div>`).join('')}
                </div>
                <div>
                    <button class="note-btn bullet-btn" title="Add bullet point"><i class="fas fa-list-ul"></i></button>
                    <button class="note-btn delete-note-btn" title="Delete note"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <div class="note-body">
                <input type="text" class="note-title" placeholder="Untitled Note">
                <textarea placeholder="Jot down your thoughts..."></textarea>
            </div>
        `;

        // --- Event Listeners for the note ---
        const titleInput = noteEl.querySelector('.note-title');
        const textarea = noteEl.querySelector('textarea');
        const deleteBtn = noteEl.querySelector('.delete-note-btn');
        const bulletBtn = noteEl.querySelector('.bullet-btn');
        const colorSwatches = noteEl.querySelectorAll('.color-swatch');

        // Safely set values to prevent HTML injection issues from stored data
        titleInput.value = note.title;
        textarea.value = note.content;

        // Set initial active state for bullet button
        bulletBtn.classList.toggle('active', note.isBulletMode);

        // Title update
        titleInput.addEventListener('input', () => {
            note.title = titleInput.value;
            saveNotes();
        });

        // Content update
        textarea.addEventListener('input', () => {
            note.content = textarea.value;
            saveNotes();
        });

        // Delete
        deleteBtn.addEventListener('click', () => {
            notes = notes.filter(n => n.id !== note.id);
            saveNotes();
            notesContainer.removeChild(noteEl);
        });

        // Bullet point
        bulletBtn.addEventListener('click', () => {
            // If bullet mode is currently OFF, this click will turn it ON and add the first bullet.
            if (!note.isBulletMode) {
                note.isBulletMode = true;
                bulletBtn.classList.add('active');

                // Insert a bullet point immediately
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(cursorPos);

                // Add a newline before the bullet unless the textarea is empty or already on a new line
                const textToInsert = (textBefore.length === 0 || textBefore.endsWith('\n')) ? '• ' : '\n• ';

                textarea.value = textBefore + textToInsert + textAfter;

                // Update cursor position and save the new content
                textarea.selectionStart = textarea.selectionEnd = cursorPos + textToInsert.length;
                note.content = textarea.value;

            } else {
                // If bullet mode is currently ON, this click will turn it OFF.
                note.isBulletMode = false;
                bulletBtn.classList.remove('active');
            }

            // Save the state change (isBulletMode) and any content changes
            saveNotes();
            textarea.focus();
        });

        // Handle Enter key for bullet points
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && note.isBulletMode) {
                e.preventDefault();
                const cursorPos = textarea.selectionStart;
                const textBefore = textarea.value.substring(0, cursorPos);
                const textAfter = textarea.value.substring(cursorPos);

                // Insert newline and bullet
                textarea.value = textBefore + '\n• ' + textAfter;

                // Update cursor position
                textarea.selectionStart = textarea.selectionEnd = cursorPos + 3; // for \n• 

                // Save the updated content
                note.content = textarea.value;
                saveNotes();
            }
        });
        // Color change
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const newColor = swatch.dataset.color;
                note.color = newColor;
                noteEl.style.backgroundColor = newColor;
                saveNotes();
            });
        });

        notesContainer.appendChild(noteEl);
    }

    addNoteBtn.addEventListener('click', () => {
        const newNote = {
            id: Date.now(),
            title: '',
            content: '',
            color: '#ffc',
            isBulletMode: false
        };
        notes.push(newNote);
        createNoteElement(newNote);
        saveNotes();
    });

    // --- App Launcher ---
    const appList = document.getElementById('app-list');
    const addAppBtn = document.getElementById('add-app-btn');
    const addAppModal = document.getElementById('add-app-modal');
    const addAppForm = document.getElementById('add-app-form');
    const appNameInput = document.getElementById('app-name-input');
    const appUrlInput = document.getElementById('app-url-input');
    const appModalTitle = document.getElementById('app-modal-title');
    const appEditIndexInput = document.getElementById('app-edit-index');
    const appsDropdownToggle = document.getElementById('apps-dropdown-toggle');
    const appsDropdownMenu = document.getElementById('apps-dropdown-menu');
    const dropdownArrow = appsDropdownToggle.querySelector('.dropdown-arrow');

    let apps = JSON.parse(localStorage.getItem('apps')) || [];

    function saveApps() {
        localStorage.setItem('apps', JSON.stringify(apps));
    }

    function renderApps() {
        appList.innerHTML = '';
        if (apps.length === 0) {
            appList.innerHTML = '<li style="padding: 0.5rem 1rem; opacity: 0.7;">No apps added yet.</li>';
            return;
        }
        apps.forEach((app, index) => {
            const li = document.createElement('li');
            li.classList.add('app-item');
            li.innerHTML = `
                <a href="${app.url}" class="app-link" target="_blank" rel="noopener noreferrer">${app.name}</a>
                <div class="app-item-controls">
                    <button class="app-control-btn edit-app-btn" data-index="${index}" title="Edit ${app.name}"><i class="fas fa-pencil-alt"></i></button>
                    <button class="app-control-btn delete-app-btn" data-index="${index}" title="Delete ${app.name}">&times;</button>
                </div>
            `;
            appList.appendChild(li);
        });
    }

    function handleAddApp(e) {
        e.preventDefault();
        const name = appNameInput.value.trim();
        let url = appUrlInput.value.trim();
        const editIndex = appEditIndexInput.value;

        if (name && url) {
            // Ensure URL has a protocol
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }

            if (editIndex !== '') {
                // Editing an existing app
                apps[parseInt(editIndex, 10)] = { name, url };
            } else {
                // Adding a new app
                apps.push({ name, url });
            }
            saveApps();
            renderApps();
            addAppModal.style.display = 'none';
        }
    }

    function deleteApp(index) {
        apps.splice(index, 1);
        saveApps();
        renderApps();
    }

    function openEditAppModal(index) {
        const app = apps[index];
        if (!app) return;

        appsDropdownMenu.classList.remove('show'); // Close the list dropdown

        // Populate and show the edit modal
        appModalTitle.textContent = 'Edit App';
        appEditIndexInput.value = index;
        appNameInput.value = app.name;
        appUrlInput.value = app.url;
        addAppModal.style.display = 'flex';
        appNameInput.focus();
    }

    // Event Listeners
    appsDropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        appsDropdownMenu.classList.toggle('show');
        dropdownArrow.classList.toggle('open');
    });

    addAppBtn.addEventListener('click', () => {
        appsDropdownMenu.classList.remove('show'); // Close the apps list dropdown

        // Reset form to "Add" mode before showing
        appModalTitle.textContent = 'Add a New App';
        appEditIndexInput.value = '';
        addAppForm.reset();

        addAppModal.style.display = 'flex';
        appNameInput.focus();
    });

    // Close dropdown if clicking outside
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            appsDropdownMenu.classList.remove('show');
            dropdownArrow.classList.remove('open');
        }
    });

    addAppForm.addEventListener('submit', handleAddApp);

    appList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-app-btn');
        if (editBtn) {
            const index = parseInt(editBtn.dataset.index, 10);
            openEditAppModal(index);
            return;
        }

        const deleteBtn = e.target.closest('.delete-app-btn');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index, 10);
            deleteApp(index);
        }
    });

    // Generic modal closing logic for the "Add App" modal
    document.querySelectorAll('.app-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Close if clicking on the overlay
                modal.style.display = 'none';
            }
        });
        const closeBtn = modal.querySelector('.app-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.style.display = 'none');
        }
    });

    // --- Universal Timer Logic ---
    const timers = {}; // Store all timer instances
    let activeTimerId = null; // Track which timer is currently running

    // Factory function to create a timer instance
    function createTimer(id, displayEl, startBtn, pauseBtn, resetBtn, workTime, breakTime, statusEl) {
        const timer = {
            id,
            displayEl,
            statusEl,
            workTime,
            breakTime,
            timeLeft: workTime,
            isPaused: true,
            interval: null,
            state: 'work', // 'work' or 'break'

            updateDisplay() {
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                this.displayEl.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
                if (this.statusEl) {
                    // Capitalize the first letter of the state (Work/Break)
                    this.statusEl.textContent = `(${this.state.charAt(0).toUpperCase() + this.state.slice(1)})`;
                }
            },

            start() {
                if (this.isPaused) {
                    // Pause any other active timer
                    if (activeTimerId && activeTimerId !== this.id) {
                        timers[activeTimerId].pause();
                    }
                    activeTimerId = this.id;

                    this.isPaused = false;
                    this.interval = setInterval(() => {
                        this.timeLeft--;
                        this.updateDisplay();
                        if (this.timeLeft <= 0) {
                            this.stop();
    
                            if (this.state === 'work') {
                                this.state = 'break';
                                this.timeLeft = this.breakTime;
                                this.updateDisplay();
                                const breakMinutes = Math.floor(this.breakTime / 60);
                                const breakSeconds = this.breakTime % 60;
                                // Alert is blocking, so the next line won't run until user clicks OK
                                alert(`Your study timer for "${this.id}" has finished. Take a break for ${breakMinutes}m ${breakSeconds}s.`);
                                this.start(); // Automatically start the break timer
                            } else { // state === 'break'
                                this.reset();
                                alert(`Your break for "${this.id}" is finished. Time to get back to work!`);
                                this.start(); // Automatically start the work timer
                            }
                        }
                    }, 1000);
                }
            },

            pause() {
                this.isPaused = true;
                clearInterval(this.interval);
                if (activeTimerId === this.id) {
                    activeTimerId = null;
                }
            },

            reset() {
                this.pause();
                this.state = 'work';
                this.timeLeft = this.workTime;
                this.updateDisplay();
            },

            stop() { // Similar to pause but for when timer finishes
                this.isPaused = true;
                clearInterval(this.interval);
                if (activeTimerId === this.id) {
                    activeTimerId = null;
                }
            }
        };

        startBtn.addEventListener('click', () => timer.start());
        pauseBtn.addEventListener('click', () => timer.pause());
        resetBtn.addEventListener('click', () => timer.reset());

        timer.updateDisplay();
        return timer;
    }

    // --- Initializations ---
    // Initialize technique timers
    document.querySelectorAll('.technique[data-timer-id]').forEach(techniqueEl => {
        const id = techniqueEl.dataset.timerId;
        const workTime = parseInt(techniqueEl.dataset.initialTime, 10);
        const breakTime = parseInt(techniqueEl.dataset.breakTime, 10);
        const displayEl = techniqueEl.querySelector('.timer-display');
        const startBtn = techniqueEl.querySelector('.timer-start');
        const pauseBtn = techniqueEl.querySelector('.timer-pause');
        const resetBtn = techniqueEl.querySelector('.timer-reset');
        const statusEl = techniqueEl.querySelector('.timer-status');

        if (id && !isNaN(workTime) && !isNaN(breakTime) && displayEl && startBtn && pauseBtn && resetBtn && statusEl) {
            timers[id] = createTimer(id, displayEl, startBtn, pauseBtn, resetBtn, workTime, breakTime, statusEl);
        }
    });

    showTime();
    setGreeting();
    setBackground();
    getQuote();
    getLocation();
    renderTodos();
    renderApps();
    notes.forEach(createNoteElement); // Render existing notes on load

    // --- Theme Toggler ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    function applyTheme(theme) {
        localStorage.setItem('theme', theme);
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('light-mode');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Load saved theme on startup
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
});