# G-Storyteller
 An open source web UI for storytelling through Google's Gemini API

## Overview

G Storyteller is a web application that lets you co-write stories with the help of Google's Gemini AI. It provides a user-friendly interface for crafting narratives, managing world entries, and customizing the appearance of the storytelling environment.

This project is built using:

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend:** Python with Flask framework
*   **AI Model:** Google's Gemini API

## Features

*   **Interactive Story Generation:** Write stories collaboratively with the Gemini AI, providing prompts and letting the AI generate the next part of the narrative.
*   **Customizable Generation Parameters:** Adjust settings like `temperature`, `top_p`, and `top_k` to fine-tune the AI's creativity and randomness.
*   **Story Management:**
    *   **Save Stories:** Automatically saves stories to your browser's local storage, so you can continue them later.
    *   **Load Stories:** Load previously saved stories from a list.
    *   **Duplicate Stories:** Create copies of existing stories with unique names.
    *   **Delete Stories:** Remove unwanted stories from your saved list.
*   **World Entries:**
    *   Create and manage "World Entries" to provide context to the AI about characters, locations, items, and other important details.
    *   World entries are automatically included in the prompt sent to the AI.
*   **Appearance Customization:**
    *   **Light/Dark Mode:** Switch between a light and a dark theme.
    *   **Font Selection:** Choose from a variety of fonts for the story text, including:
        *   Source Sans Pro (default)
        *   Times New Roman
        *   Segoe UI
        *   Caveat (handwriting style)
        *   Roboto Mono (monospace)
        *   Arial
        *   Verdana
        *   Press Start 2P (pixel art style)
    *   **Font Size:** Adjust the font size of the story text.
    *   **Generated Text Color:** Customize the color of the newly generated text.
    *   **Reset to Default:** Reset all appearance settings to their defaults.
*   **API Key Management:**
    *   Optionally save your Gemini API key in your browser's local storage.
    *   Ability to load the API key from an `api_key.txt` file in your `Documents` folder (overrides the API key in the UI).
*   **Responsive Design:** The layout adapts to different screen sizes.
*   **Hotkey:** Press Ctrl+Enter to generate new text.
*   **Resizable Panels:** The left and right panels can be resized to adjust their widths.
*   **Cancel Generation:** You can cancel the generation process while it's in progress.

## Prerequisites

*   **Python 3.7+:** Ensure you have Python 3.7 or higher installed on your system.
*   **pip:** The package installer for Python.
*   **Gemini API Key:** You'll need a Gemini API key to use the AI features. See instructions below on how to get one.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on "Create API key".
3. You can either create an API key on a new project or select an existing Google Cloud project.
4. Copy the generated API key.

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Create a virtual environment (recommended):**

    ```bash
    python3 -m venv venv
    ```

3. **Activate the virtual environment:**

    *   **Linux/macOS:**

        ```bash
        source venv/bin/activate
        ```

    *   **Windows:**

        ```bash
        venv\Scripts\activate
        ```

4. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

## Usage

1. **Run the Flask app:**

    ```bash
    python app.py
    ```

2. **Open your web browser and go to:**

    ```
    http://127.0.0.1:5000/
    ```

3. **Enter your Gemini API key:**

    *   You can paste your API key into the "Gemini API Key" field in the application.
    *   Optionally, check the "Save API Key" box to store it in local storage.
    *   Alternatively, you can create a file named `api_key.txt` in your "Documents" folder and paste your API key into it. The application will prioritize using the API key from this file.

4. **Start writing!**
    *   Enter a title for your story.
    *   Add optional story tags, additional details, and plot direction.
    *   Click "Generate" to start the story or continue writing.
    *   Use the "Appearance" settings to customize the look and feel of the application.
    *   Create "World Entries" to provide context for the AI.

## Project Structure

*   **`app.py`:** The main Flask application file, containing the backend logic.
*   **`static/`:** Contains static assets:
    *   **`style.css`:** CSS stylesheet for the application.
    *   **`script.js`:** JavaScript code for frontend interactions and logic.
    *   **`img/`:** Folder for images (logo, favicon, etc.).
*   **`templates/`:** Contains the `index.html` template file.
*   **`requirements.txt`:** Lists the required Python packages.
*   **`runtime.txt`:** Specifies the Python version for deployment.
*   **`Procfile`:** Configuration file for deployment platforms like Heroku.
*   **`README.md`:** This file, providing information about the project.

## Deployment

You can deploy this application to various hosting services, including:

*   **Netlify:** Ideal for static sites with a frontend focus.
*   **Vercel:** Similar to Netlify, good for static sites and JAMstack applications.
*   **Heroku:** Supports server-side code (Python/Flask) and is suitable for more dynamic applications.
*   **PythonAnywhere:** Specifically designed for hosting Python web applications.

Refer to the documentation of your chosen hosting service for detailed deployment instructions.

## Contributing

Contributions are welcome! If you find any bugs or want to suggest new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
