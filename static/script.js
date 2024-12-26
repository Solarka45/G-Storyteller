document.addEventListener('DOMContentLoaded', function() {
    let isGenerating = false;
    let controller = new AbortController();

    const generateButton = document.getElementById('generate-button');
    const spinner = document.getElementById('spinner');
    const storyList = document.querySelector('.story-list'); // Get the story list container

    // Slider definitions
    const temperatureSlider = document.getElementById('temperature-slider');
    const temperatureInput = document.getElementById('temperature-input');
    const outputLengthSlider = document.getElementById('output-length-slider');
    const outputLengthInput = document.getElementById('output-length-input');
    const topPSlider = document.getElementById('top-p-slider');
    const topPInput = document.getElementById('top-p-input');
    const topKSlider = document.getElementById('top-k-slider');
    const topKInput = document.getElementById('top-k-input');

    // Function to get all form data
    function getFormData() {
        const saveApiKey = document.getElementById('save-api-key').checked;
        const apiKey = saveApiKey ? document.getElementById('api-key').value : ''; // Save API key only if checkbox is checked

        return {
            selected_model: document.getElementById('model-select').value,
            story_title: document.getElementById('story-title').value,
            story_tags: document.getElementById('story-tags').value,
            additional_details: document.getElementById('additional-details').value,
            plot_direction: document.getElementById('plot-direction').value,
            story_content: document.getElementById('story-editor').innerHTML,
            system_instruction: document.getElementById('system-instruction').value,
            temperature: parseFloat(temperatureInput.value),
            outputLength: parseFloat(outputLengthInput.value),
            top_p: parseFloat(topPInput.value),
            top_k: parseInt(topKInput.value),
            api_key: apiKey,
            save_api_key: saveApiKey
        };
    }

    // Function to set all form data
    function setFormData(data) {
        document.getElementById('model-select').value = data.selected_model;
        document.getElementById('story-title').value = data.story_title;
        document.getElementById('story-tags').value = data.story_tags;
        document.getElementById('additional-details').value = data.additional_details;
        document.getElementById('plot-direction').value = data.plot_direction;
        document.getElementById('story-editor').innerHTML = data.story_content;
        document.getElementById('system-instruction').value = data.system_instruction;
        updateTemperature(data.temperature);
        updateOutputLength(data.outputLength);
        updateTopP(data.top_p);
        updateTopK(data.top_k);
        document.getElementById('save-api-key').checked = data.save_api_key;

        // Only set API key if it was saved
        if (data.save_api_key) {
            document.getElementById('api-key').value = data.api_key;
        }
    }

    // Function to save story data to localStorage
    function saveStory(storyTitle, data) {
        localStorage.setItem(storyTitle, JSON.stringify(data));
        console.log(`Story "${storyTitle}" saved.`);
        loadStoryList(); // Refresh the story list
    }

    // Function to load story data from localStorage
    function loadStory(storyTitle) {
        const data = JSON.parse(localStorage.getItem(storyTitle));
        if (data) {
            setFormData(data);
            console.log(`Story "${storyTitle}" loaded.`);
        } else {
            console.error(`Story "${storyTitle}" not found.`);
        }
    }

    // Function to delete a story from localStorage
    function deleteStory(storyTitle) {
        localStorage.removeItem(storyTitle);
        console.log(`Story "${storyTitle}" deleted.`);
        loadStoryList(); // Refresh the story list
    }

    // Function to load and display the list of saved stories
    function loadStoryList() {
        storyList.innerHTML = ''; // Clear the current list
    
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
    
            // Check if the key belongs to a story (not appearance settings or other items)
            if (key !== 'appearanceSettings' && key !== 'api_key') {
                const storyTitle = key; // Key is the story title
                const storyPanel = document.createElement('div');
                storyPanel.classList.add('story-panel');
                storyPanel.innerHTML = `
                    <h3>${storyTitle}</h3>
                    <button class="delete-button">Delete</button>
                `;
    
                storyPanel.addEventListener('click', function(event) {
                    if (event.target.classList.contains('delete-button')) {
                        // Delete button clicked
                        if (confirm(`Are you sure you want to delete the story "${storyTitle}"?`)) {
                            deleteStory(storyTitle);
                        }
                    } else {
                        // Story panel clicked
                        loadStory(storyTitle);
                    }
                });
    
                storyList.appendChild(storyPanel);
            }
        }
    }

    // SLIDER SETTINGS
    function updateTemperature(value) {
        temperatureInput.value = value;
        temperatureSlider.value = value;
    }
    function updateOutputLength(value) {
        outputLengthInput.value = value;
        outputLengthSlider.value = value;
    }
    function updateTopP(value) {
        topPInput.value = value;
        topPSlider.value = value;
    }
    function updateTopK(value) {
        topKInput.value = value;
        topKSlider.value = value;
    }

    // Update temperature when the slider is moved
    temperatureSlider.addEventListener('input', function() {
        updateTemperature(temperatureSlider.value);
    });
    // Update temperature when the number input is changed
    temperatureInput.addEventListener('input', function() {
        let value = parseFloat(temperatureInput.value);
        if (isNaN(value) || value < 0) {
            value = 0;
        } else if (value > 2) {
            value = 2;
        }
        updateTemperature(value);
    });

    // Update output length when the slider is moved
    outputLengthSlider.addEventListener('input', function() {
        updateOutputLength(outputLengthSlider.value);
    });
    // Update output length when the number input is changed
    outputLengthInput.addEventListener('input', function() {
        let value = parseInt(outputLengthInput.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 2048) {
            value = 2048;
        }
        updateOutputLength(value);
    });

    // Update top_p when the slider is moved
    topPSlider.addEventListener('input', function() {
        updateTopP(topPSlider.value);
    });
    // Update top_p when the number input is changed
    topPInput.addEventListener('input', function() {
        let value = parseFloat(topPInput.value);
        if (isNaN(value) || value < 0) {
            value = 0;
        } else if (value > 1) {
            value = 1;
        }
        updateTopP(value);
    });

    // Update top_k when the slider is moved
    topKSlider.addEventListener('input', function() {
        updateTopK(topKSlider.value);
    });
    // Update top_k when the number input is changed
    topKInput.addEventListener('input', function() {
        let value = parseInt(topKInput.value);
        if (isNaN(value) || value < 0) {
            value = 0;
        } else if (value > 1) {
            value = 1;
        }
        updateTopK(value);
    });

    // Call loadStoryList on page load to display saved stories
    loadStoryList();

    // APPEARANCE SETTINGS
    const lightModeRadio = document.getElementById('light-mode');
    const darkModeRadio = document.getElementById('dark-mode');
    const serviceLogo = document.getElementById('service-logo');
    const fontFamilySelect = document.getElementById('font-family-select');
    const fontSizeInput = document.getElementById('font-size-input');
    const textColorInput = document.getElementById('text-color-input');

    // Function to apply the selected theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            serviceLogo.src = 'static/img/logo_dark.webp';
        } else {
            document.body.classList.remove('dark-theme');
            serviceLogo.src = 'static/img/logo_light.webp';
        }
    }

    // Function to apply the selected font family to the story editor
    function applyFontFamily(fontFamily) {
        const storyEditor = document.getElementById('story-editor');
        storyEditor.style.fontFamily = fontFamily;
    }

    // Function to apply the selected font size to the story editor
    function applyFontSize(fontSize) {
        const storyEditor = document.getElementById('story-editor');
        storyEditor.style.fontSize = `${fontSize}px`;
    }

    // Function to apply the selected text color to newly generated text
    function applyTextColor(textColor) {
        // This will be used when generating new text in the generateButton event listener
        textColorInput.value = textColor; // Update the input value just in case
    }

    // Function to save appearance settings to localStorage
    function saveAppearanceSettings() {
        const settings = {
            theme: lightModeRadio.checked ? 'light' : 'dark',
            fontSize: parseInt(fontSizeInput.value),
            fontFamily: fontFamilySelect.value,
            textColor: textColorInput.value, // Get selected text color
            // Add other appearance settings here when needed
        };
        localStorage.setItem('appearanceSettings', JSON.stringify(settings));
        console.log('Appearance settings saved.');
    }

    // Function to load appearance settings from localStorage
    function loadAppearanceSettings() {
        const settings = JSON.parse(localStorage.getItem('appearanceSettings'));
        if (settings) {
            // Apply theme
            if (settings.theme === 'dark') {
                darkModeRadio.checked = true;
            } else {
                lightModeRadio.checked = true;
            }
            applyTheme(settings.theme);

            // Set font size
            if (settings.fontSize) {
                fontSizeInput.value = settings.fontSize;
                applyFontSize(settings.fontSize);
            }

            // Set font family
            if (settings.fontFamily) {
                fontFamilySelect.value = settings.fontFamily;
                applyFontFamily(settings.fontFamily);
            }

            // Set text color
            if (settings.textColor) {
                textColorInput.value = settings.textColor;
                applyTextColor(settings.textColor);
            }
            // Load other appearance settings here when needed
        }
    }

    // Event listeners for appearance settings
    lightModeRadio.addEventListener('change', () => {
        applyTheme('light');
        saveAppearanceSettings();
    });
    darkModeRadio.addEventListener('change', () => {
        applyTheme('dark');
        saveAppearanceSettings();
    });
    // Add an event listener to the font family select
    fontFamilySelect.addEventListener('change', () => {
        const fontFamily = fontFamilySelect.value;
        applyFontFamily(fontFamily);
        saveAppearanceSettings();
    });``
    // Add an event listener to the font size input
    fontSizeInput.addEventListener('change', () => {
        const fontSize = parseInt(fontSizeInput.value);
        applyFontSize(fontSize);
        saveAppearanceSettings();
    });
    // Add an event listener to the text color input
    textColorInput.addEventListener('change', () => {
        const textColor = textColorInput.value;
        applyTextColor(textColor);
        saveAppearanceSettings();
    });

    // Load appearance settings on page load
    loadAppearanceSettings();

    generateButton.addEventListener('click', function() {
        if (!isGenerating) {
            // Start generation
            isGenerating = true;
            controller = new AbortController();
            const signal = controller.signal;

            generateButton.innerHTML = 'Cancel <span id="spinner" style="display: inline;"><img src="static/spinner.svg" alt="Loading..." style="width: 20px; height: 20px;"></span>';

            const formData = getFormData();
            
            const temperature = parseFloat(temperatureInput.value);
            const outputLength = parseFloat(outputLengthInput.value);
            const topP = parseFloat(topPInput.value);
            const topK = parseInt(topKInput.value);

            const data = {
                api_key: formData.api_key,
                selected_model: formData.selected_model,
                story_title: formData.story_title,
                story_tags: formData.story_tags,
                additional_details: formData.additional_details,
                plot_direction: formData.plot_direction,
                story_content: formData.story_content,
                system_instruction: formData.system_instruction,
                temperature: temperature,
                outputLength: outputLength,
                top_p: topP,
                top_k: topK
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
                    // Reset color of previously generated text
                    resetPreviousTextColors(storyEditor);
                    // Clean the existing text while preserving newlines
                    let cleanedExistingText = storyEditor.innerText.replace(/ +/g, ' ');
                    // Convert the cleaned existing text to HTML with spans for color
                    let existingHtml = convertTextToHtml(cleanedExistingText);
                    // Convert the new generated text to HTML with spans for color
                    let newHtml = convertTextToHtml(result.generated_text, textColorInput.value);
                    // Combine the cleaned existing HTML with the new HTML
                    storyEditor.innerHTML = existingHtml + (existingHtml.endsWith('<br>') || existingHtml === '' ? '' : ' ') + newHtml;
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

            // Save the story after generation
            saveStory(formData.story_title, formData);
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

    // Add an event listener for keydown events
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            // Prevent the default behavior of Ctrl + Enter (e.g., adding a new line)
            event.preventDefault();

            // Trigger the generate button
            generateButton.click();
        }
    });

    // Function to convert innerText to HTML with <br> tags for newlines and spans for color
function convertTextToHtml(text, color = 'black') {
    // Replace newlines with <br> tags
    text = text.replace(/\n+/g, '<br>');
    // Check if dark mode is active and adjust default color
    if (document.body.classList.contains('dark-theme')) {
        if (color === 'black') {
            color = 'white'; // Change default color to white in dark mode
        } else if (color === 'darkmagenta') {
            color = '#c792ea'; // light purple
        }
    }
    // Wrap the entire text in a span with the specified color
    return `<span style="color: ${color};">${text}</span>`;
}

// Function to reset the color of previously generated text to black or white
function resetPreviousTextColors(storyEditor) {
    const spans = storyEditor.querySelectorAll('span[style*="color: darkmagenta"], span[style*="color: #c792ea"]');
    spans.forEach(span => {
        // Check if dark mode is active and adjust color accordingly
        if (document.body.classList.contains('dark-theme')) {
            span.style.color = 'white';
        } else {
            span.style.color = 'black';
        }
    });
}

    // Resizer logic
    const leftResizer = document.getElementById('left-resizer');
    const rightResizer = document.getElementById('right-resizer');
    const leftPanel = document.querySelector('.left-panel');
    const centerSection = document.querySelector('.center-section');
    const sideSection = document.querySelector('.side-section');

    let isResizingLeft = false;
    let isResizingRight = false;

    leftResizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isResizingLeft = true;
        document.addEventListener('mousemove', handleLeftMouseMove);
        document.addEventListener('mouseup', handleLeftMouseUp);
    });

    rightResizer.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isResizingRight = true;
        document.addEventListener('mousemove', handleRightMouseMove);
        document.addEventListener('mouseup', handleRightMouseUp);
    });

    function handleLeftMouseMove(e) {
        if (!isResizingLeft) return;
        const containerOffsetLeft = leftPanel.offsetLeft;
        const pointerRelativeXpos = e.clientX - containerOffsetLeft;
        const leftPanelWidth = pointerRelativeXpos;
        const centerSectionWidth = (window.innerWidth - leftPanelWidth) * 0.7;
        const sideSectionWidth = (window.innerWidth - leftPanelWidth) * 0.3;

        leftPanel.style.width = `${leftPanelWidth}px`;
        centerSection.style.width = `${centerSectionWidth}px`;
        sideSection.style.width = `${sideSectionWidth}px`;
        leftPanel.style.flex = 'none';
        centerSection.style.flex = 'none';
        sideSection.style.flex = 'none';
    }

    function handleRightMouseMove(e) {
        if (!isResizingRight) return;
        const centerSectionOffsetRight = centerSection.offsetLeft + centerSection.offsetWidth;
        const pointerRelativeXpos = e.clientX;
        const sideSectionWidth = window.innerWidth - pointerRelativeXpos;
        const centerSectionWidth = pointerRelativeXpos - centerSection.offsetLeft;

        centerSection.style.width = `${centerSectionWidth}px`;
        sideSection.style.width = `${sideSectionWidth}px`;
        centerSection.style.flex = 'none';
        sideSection.style.flex = 'none';
    }

    function handleLeftMouseUp() {
        isResizingLeft = false;
        document.removeEventListener('mousemove', handleLeftMouseMove);
        document.removeEventListener('mouseup', handleLeftMouseUp);
    }

    function handleRightMouseUp() {
        isResizingRight = false;
        document.removeEventListener('mousemove', handleRightMouseMove);
        document.removeEventListener('mouseup', handleRightMouseUp);
    }
});