document.addEventListener('DOMContentLoaded', function() {
    let isGenerating = false;
    let controller = new AbortController();

    const generateButton = document.getElementById('generate-button');
    const spinner = document.getElementById('spinner');

    generateButton.addEventListener('click', function() {
        if (!isGenerating) {
            // Start generation
            isGenerating = true;
            controller = new AbortController();
            const signal = controller.signal;

            generateButton.innerHTML = 'Cancel <span id="spinner" style="display: inline;"><img src="static/spinner.svg" alt="Loading..." style="width: 20px; height: 20px;"></span>';

            const apiKey = document.getElementById('api-key').value;
            const selectedModel = document.getElementById('model-select').value; // Get selected model
            const storyTitle = document.getElementById('story-title').value;
            const storyTags = document.getElementById('story-tags').value;
            const settingDescription = document.getElementById('setting-description').value;
            const memory = document.getElementById('memory').value;
            const storyContent = document.getElementById('story-editor').innerText;
            const systemInstruction = document.getElementById('system-instruction').value; // Get system instruction

            const data = {
                api_key: apiKey,
                selected_model: selectedModel,
                story_title: storyTitle,
                story_tags: storyTags,
                setting_description: settingDescription,
                memory: memory,
                story_content: storyContent,
                system_instruction: systemInstruction // Add to data
            };

            fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                body: JSON.stringify(data),
                signal: signal
            })
            .then(response => {
                if (!response.ok) {
                    // Handle non-OK responses, including cancellations
                    return response.text().then(text => {
                        // Attempt to parse as JSON, but don't throw an error if it fails
                        let data;
                        try {
                            data = JSON.parse(text);
                        } catch (err) {
                            // Ignore JSON parsing errors for now
                        }

                        if (response.status === 400 && data && data.cancelled) {
                            // Cancellation successful, even if JSON parsing failed
                            throw new Error('Generation cancelled by user.');
                        } else {
                            // Other error, report the original text response
                            throw new Error(data ? data.error : `Server responded with status ${response.status}`);
                        }
                    });
                }
                return response.json();
            })
            .then(result => {
                if (result.error) {
                    console.error('Error:', result.error);
                    alert('Error: ' + result.error);
                } else {
                    const storyEditor = document.getElementById('story-editor');
                    storyEditor.innerText += '\n\n' + result.generated_text;
                }
            })
            .catch(error => {
                if (error.name === 'AbortError' || error.message === 'Generation cancelled by user.') {
                    console.log('Fetch aborted or generation cancelled.');
                } else {
                    console.error('Error:', error);
                    alert(error.message || 'An unexpected error occurred.');
                }
            })
            .finally(() => {
                isGenerating = false;
                generateButton.innerHTML = 'Generate';
            });
        } else {
            // Cancel generation
            controller.abort();
            fetch('/cancel_generation', {
                method: 'POST',
            })
            .then(response => {
                if (!response.ok) {
                    // Handle non-OK responses from /cancel_generation
                    throw new Error('Failed to cancel generation.');
                }
                return response.json();
            })
            .then(data => {
                if (data.cancelled) {
                    console.log('Generation cancelled by user.');
                } else {
                    console.error('Error cancelling generation.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'An error occurred while cancelling.');
            });
        }
    });
});