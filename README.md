# G-Storyteller
 An open source web UI for storytelling through Google's Gemini API

## Overview

G Storyteller is a web application that lets you co-write stories with the help of Google's Gemini AI. It provides a user-friendly interface for crafting narratives, managing world entries, and customizing the appearance of the storytelling environment.

## Features

*   **Interactive Story Generation:** Write stories collaboratively with the Gemini AI, one of the most powerful AI text generation models.
*   **Customizable Generation Parameters:** Adjust settings like to fine-tune the AI's creativity and randomness.
*   **Secure Stories Storage:** Automatically saves stories to your browser's local storage, so you can continue them later. We do not have any kind of access to them.
*   **World Entries:**
    *   Create and manage "World Entries" to provide context to the AI about characters, locations, items, and other important details.
    *   World entries are automatically included in the prompt sent to the AI.
*   **Appearance Customization:** Customize how the editor looks.
*   **API Key Management:**
    *   Optionally save your Gemini API key in your browser's local storage.
    *   Ability to load the API key from an `api_key.txt` file in your `Documents` folder (overrides the API key in the UI).
*   **Responsive Design:** The layout adapts to different screen sizes.

## Prerequisites

*   **Gemini API Key:** You'll need a Gemini API key to use the AI features. See instructions below on how to get one.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on "Create API key".
3. You can either create an API key on a new project or select an existing Google Cloud project.
4. Copy the generated API key.

## Usage

1. **Go to g-storyteller.vercel.app**

2. **Start writing!**
    *   Enter a title for your story.
    *   Add optional story tags, additional details, and plot direction.
    *   Create "World Entries" to provide context for the AI.
    *   Click "Generate" to start the story or continue writing.
    *   Use the "Appearance" settings to customize the look and feel of the application.

## Contributing

Contributions are welcome! If you find any bugs or want to suggest new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
