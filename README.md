# Restart AI Quiz Generator

A modern, single-page web application that generates dynamic quizzes using Artificial Intelligence. Enter any topic, choose your difficulty, and test your knowledge instantly!

## 🚀 Features

*   **AI-Powered Questions**: Uses Google Gemini API to generate unique questions on *any* topic.
*   **Customizable Experience**:
    *   Choose your topic.
    *   Select number of questions (1-10).
    *   Set difficulty level (Easy, Medium, Hard).
*   **Interactive Interface**:
    *   Professional, responsive dark-themed UI.
    *   Single-choice scoring logic.
    *   Instant feedback and scoring system.
*   **No Database/Auth**: Simple, lightweight, and privacy-focused.

## 🛠️ Technology Stack

*   **Frontend**: Vanilla JavaScript
*   **Styling**: Modern CSS3 (Variables, Flexbox/Grid)
*   **Build Tool**: Vite
*   **AI Service**: Google Gemini API

## 📦 Installation & Setup

1.  **Clone the repository** (or download files):
    ```bash
    git clone <repository-url>
    cd aiquiz
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure API Key**:
    *   Get a free API Key from [Google AI Studio](https://makersuite.google.com/app/apikey).
    *   Open `api.js` and replace the placeholder with your key:
        ```javascript
        const API_KEY = 'YOUR_API_KEY_HERE';
        ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```
    Open your browser to the URL shown (usually `http://localhost:5173` or similar).

## 👤 Credits

**Created By Banu Begum**
