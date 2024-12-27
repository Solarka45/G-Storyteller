# G-Storyteller
 An open source web UI for storytelling through Google's Gemini API

## Overview

G Storyteller is a web application that lets you co-write stories with the help of Google's Gemini AI. It provides a user-friendly interface for crafting narratives, managing world entries, and customizing the appearance of the storytelling environment.

## Features

*   **Interactive Story Generation:** Write stories collaboratively with the Gemini AI, one of the most powerful AI text generation models.
*   **Channel the power of Gemini** Write with a very smart model, and, most importantly, over 1 million tokens worth of memory. Unless your story is longer than 7-8 average novels, the model will remember it all!
*   **Customizable Generation Parameters:** Adjust settings like to fine-tune the AI's creativity and randomness.
*   **Secure Stories Storage:** Automatically saves stories to your browser's local storage, so you can continue them later. We do not have any kind of access to them.
*   **World Entries:**
    *   Create and manage "World Entries" to provide context to the AI about characters, locations, items, and other important details.
    *   World entries are automatically included in the prompt sent to the AI.
*   **Appearance Customization:** Customize how the editor looks.
*   **Responsive Design:** The layout adapts to different screen sizes.

## Prerequisites

*   **Gemini API Key:** You'll need a Gemini API key to use the AI features. See instructions below on how to get one.

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on "Create API key".
3. You can either create an API key on a new project or select an existing Google Cloud project.
4. Copy the generated API key.
5. Paste the API key into the corresponding field in G Storyteller. It will not be saved unless to choose to, even then it will only be saved for the current story.
OR
5. Create a file "api_key.txt" (case-sensitive) in your Documents folder and copy the key there. This way, it will always be referenced from there.

## Usage

1. Download the [latest release](https://github.com/Solarka45/G-Storyteller/releases)

2. Unzip the package and run G_Storyteller.exe. Wait for the web interface to start.

3. **Start writing!**
    *   Enter a title for your story.
    *   Add optional story tags, additional details, and plot direction.
    *   Create "World Entries" to provide context for the AI.
    *   Click "Generate" to start the story or continue writing.
    *   Use the "Appearance" settings to customize the look and feel of the application.

## Tips and warnings

1. The story save slots are assigned based on title. It you enter a new title, the story will save separately from that point on. Similarly, if you repeat an old story title, the old story WILL BE OVERWRITTEN. Thus it is recommended to enter the title as the first you do, and avoid repeating them.
2. The story is saved only when you finish a new generation, or when you make a manual edit to the text. Editing any of the settings, fields, world entries will NOT cause your story to save. If you make a lot of changes to these, it is recommended to make some random edits to the body of the story to make sure everything is saved.
3. Your appearance settings are saved upon change regardless of anything else, so no worries here.
4. The model is not primarily focused on continuing existing text, so sometimes it might create extra spaces, put spaces before commas, and other similar minor hallucinations. Remember that you can manually all of these out whenever you want.
5. The rate limit for each model is separate. Thus if you exhaust your Flash 2.0 generations you can swap to another model.
6. The rate is limiter on both per-day and per-minute basis. If you run out of the per-minute quota due to spamming generations, it doesn't mean you ran out of the daily ones.
7. Despite having a huge context size, the more context you have, the slower generations will be. Thus the longer your story, the longer it will take to generate, especially with slower models. 
8. The default settings are aimed to provide a balance between consistency and creativity. Feel free to play around with them to search for the best results.

## Contributing

Contributions are welcome! If you find any bugs or want to suggest new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
