# Gen Focus Dashboard

A beautiful and feature-rich personal dashboard designed to enhance focus, productivity, and create a calm digital environment. Built with vanilla HTML, CSS, and JavaScript.

<!-- It's a great idea to add a screenshot of your project here! -->
<!-- ![Gen Focus Screenshot](screenshot.png) -->

## ✨ Features

**Dashboard:**
*   **Live Clock & Greeting:** Displays the current time and a personalized greeting that changes based on the time of day.
*   **Dynamic Background:** Fetches a new stunning nature or landscape photo from Unsplash on every page load.
*   **Weather Widget:** Shows the current temperature and city based on your location using the OpenWeatherMap API.
*   **Inspirational Quotes:** Presents a new quote on every refresh to keep you motivated.
*   **Colorful To-Do List:** Add, complete, and delete your daily tasks. The list is saved to your browser's local storage and features a pleasant pastel rainbow color scheme.

**Study Techniques:**
*   **Interactive Timers:** Learn about and use popular productivity methods like the Pomodoro Technique, the 52/17 Method, and the Ultradian Rhythm Technique.
*   **Dedicated Timers:** Each technique has its own interactive timer that you can start, pause, and reset.

**Concentration Music:**
*   **Curated Playlists:** A tabbed section with embedded YouTube streams for Binaural Beats, Relaxing Piano, and Relaxing Violin music.
*   **Custom Mode:** Paste any YouTube video URL to create your own custom focus music session.

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **APIs:**
    *   [OpenWeatherMap API](https://openweathermap.org/api) for weather data.
    *   [Unsplash API](https://unsplash.com/developers) for dynamic backgrounds.
    *   [Quotable API](https://github.com/lukePeavey/quotable) for inspirational quotes.
*   **Icons:** [Font Awesome](https://fontawesome.com/)

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository or download the files.**
    If you have Git installed, you can run:
    ```bash
    git clone https://github.com/your-username/gen-focus.git
    ```

2.  **Get an API Key:**
    *   The project requires an API key from OpenWeatherMap for the weather widget. Sign up for a free account at [openweathermap.org](https://home.openweathermap.org/users/sign_up) to get one.

3.  **Add the API Key:**
    *   Open the `script.js` file.
    *   Find the `getWeather` function and replace the placeholder API key with your own.

4.  **Run the application:**
    *   Simply open the `index.html` file in your favorite web browser.

## Credits

This project was created as a fun and feature-rich dashboard. It utilizes several fantastic free APIs to provide its dynamic content.

## 📦 Bonus: Set as New Tab Page

You can set this dashboard as your default new tab page in Chrome or Edge by loading it as a browser extension.

1.  **Create the `manifest.json` file:**
    In the root of your project folder, create a file named `manifest.json` with the following content:

    ```json
    {
      "manifest_version": 3,
      "name": "Gen Focus",
      "version": "1.0",
      "description": "A personal dashboard for focus and productivity on every new tab.",
      "chrome_url_overrides": {
        "newtab": "index.html"
      }
    }
    ```

2.  **Load the extension in your browser:**

    **For Google Chrome**
    *   Open Chrome and navigate to `chrome://extensions` in the address bar.
    *   In the top right corner, turn on the **"Developer mode"** toggle.
    *   Click the **"Load unpacked"** button that appears.
    *   Navigate to and select your project folder, then click "Select Folder".

    **For Microsoft Edge**
    *   Open Edge and navigate to `edge://extensions` in the address bar.
    *   On the bottom left, turn on the **"Developer mode"** toggle.
    *   Click the **"Load unpacked"** button that appears.
    *   Navigate to and select your project folder, then click "Select Folder".

    Now, every time you open a new tab, you'll see your Gen Focus dashboard!