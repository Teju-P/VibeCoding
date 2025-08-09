// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    // --- DOM Elements ---
    const timeEl = document.getElementById('time');
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
        const today = new Date();
        const hour = today.getHours();
        const min = today.getMinutes();
        const sec = today.getSeconds();

        timeEl.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
        setTimeout(showTime, 1000);
    }

    function addZero(n) {
        return (parseInt(n, 10) < 10 ? '0' : '') + n;
    }

    function setGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) {
            greetingEl.textContent = 'Good Morning,';
        } else if (hour < 18) {
            greetingEl.textContent = 'Good Afternoon,';
        } else {
            greetingEl.textContent = 'Good Evening,';
            document.body.style.color = 'white';
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

    // --- Universal Timer Logic ---
    const timers = {}; // Store all timer instances
    let activeTimerId = null; // Track which timer is currently running

    // Factory function to create a timer instance
    function createTimer(id, displayEl, startBtn, pauseBtn, resetBtn, initialTime) {
        const timer = {
            id,
            displayEl,
            initialTime,
            timeLeft: initialTime,
            isPaused: true,
            interval: null,

            updateDisplay() {
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                this.displayEl.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
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
                            alert(`Timer for "${this.id}" has finished!`);
                            this.reset();
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
                this.timeLeft = this.initialTime;
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
        const initialTime = parseInt(techniqueEl.dataset.initialTime, 10);
        const displayEl = techniqueEl.querySelector('.timer-display');
        const startBtn = techniqueEl.querySelector('.timer-start');
        const pauseBtn = techniqueEl.querySelector('.timer-pause');
        const resetBtn = techniqueEl.querySelector('.timer-reset');

        if (id && displayEl && startBtn && pauseBtn && resetBtn) {
            timers[id] = createTimer(id, displayEl, startBtn, pauseBtn, resetBtn, initialTime);
        }
    });

    showTime();
    setGreeting();
    setBackground();
    getQuote();
    getLocation();
    renderTodos();
});