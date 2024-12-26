document.addEventListener('DOMContentLoaded', function() {
    let isGenerating = false;
    let controller = new AbortController();

    const generateButton = document.getElementById('generate-button');
    const spinner = document.getElementById('spinner');
    const storyList = document.querySelector('.story-list'); // Get the story list container

    // Get the story editor element
    const storyEditor = document.getElementById('story-editor');

    // Function to handle manual edits to the story editor
    function handleStoryEditorInput() {
        if (event.inputType === 'insertParagraph') {
            // Prevent the default behavior of inserting a newline character
            event.preventDefault();
    
            // Insert an en space character instead
            document.execCommand('insertHTML', false, ' ');
        }

        const formData = getFormData(); // Get all form data
        formData.story_content = storyEditor.innerHTML; // Update story_content with edited HTML
        saveStory(formData.story_title, formData); // Save the story
    }

    // Add an event listener for the 'input' event on the story editor
    storyEditor.addEventListener('input', handleStoryEditorInput);

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
        const apiKey = saveApiKey ? document.getElementById('api-key').value : '';

        // Get world entries data
        const worldEntries = [];
        const worldEntryPanels = document.querySelectorAll('.world-entry-panel');
        worldEntryPanels.forEach(panel => {
            const entryType = panel.querySelector('.entry-type-input').value;
            const entryName = panel.querySelector('.entry-name-input').value;
            const entryDescription = panel.querySelector('.entry-description-input').value;
            worldEntries.push({
                type: entryType,
                name: entryName,
                description: entryDescription
            });
        });

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
            save_api_key: saveApiKey,
            world_entries: worldEntries // Add world entries to form data
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

        // Set world entries
        if (data.world_entries) {
            worldEntriesContainer.innerHTML = ''; // Clear existing entries
            data.world_entries.forEach(entry => {
                createWorldEntryPanel(entry);
            });
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

    // Function to duplicate an existing story  
    function duplicateStory(originalStoryTitle) {
        const originalStoryData = JSON.parse(localStorage.getItem(originalStoryTitle));
        if (originalStoryData) {
            // Find a unique name for the new story
            let newStoryTitle = `${originalStoryTitle} (1)`;
            let i = 2;
            while (localStorage.getItem(newStoryTitle)) {
                newStoryTitle = `${originalStoryTitle} (${i})`;
                i++;
            }

            // Create a deep copy of the story data using JSON.parse(JSON.stringify())
            const newStoryData = JSON.parse(JSON.stringify(originalStoryData));

            // Update the story_title in the new data
            newStoryData.story_title = newStoryTitle;

            saveStory(newStoryTitle, newStoryData);
            console.log(`Story "${originalStoryTitle}" duplicated to "${newStoryTitle}".`);
        } else {
            console.error(`Story "${originalStoryTitle}" not found.`);
        }
    }

    // Function to load and display the list of saved stories
    function loadStoryList() {
        storyList.innerHTML = ''; // Clear the current list

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // Check if the key belongs to a story (not appearance settings or other items)
            if (key !== 'appearanceSettings' && key !== 'api_key') {
                const storyTitle = key;
                const storyPanel = document.createElement('div');
                storyPanel.classList.add('story-panel');
                storyPanel.innerHTML = `
                    <h3>${storyTitle}</h3>
                    <button class="delete-button">Delete</button>
                    <button class="duplicate-button">Duplicate</button>
                `;

                // Add event listener to the story panel
                storyPanel.addEventListener('click', function(event) {
                    if (event.target.classList.contains('delete-button')) {
                        // Delete button clicked
                        if (confirm(`Are you sure you want to delete the story "${storyTitle}"?`)) {
                            deleteStory(storyTitle);
                        }
                    } else if (event.target.classList.contains('duplicate-button')) {
                        // Duplicate button clicked
                        duplicateStory(storyTitle);
                    } else {
                        // Story panel clicked
                        loadStory(storyTitle);
                    }
                });

                storyList.appendChild(storyPanel);
            }
        }
    }

    // WORLD ENTRIES
    const addWorldEntryButton = document.getElementById('add-world-entry-button');
    const worldEntriesContainer = document.getElementById('world-entries-container');

    // Function to create a new world entry panel
    function createWorldEntryPanel(data = null) {
        const entryPanel = document.createElement('div');
        entryPanel.classList.add('world-entry-panel');

        const entryTypeLabel = document.createElement('label');
        entryTypeLabel.textContent = 'Entry Type:';
        const entryTypeInput = document.createElement('input');
        entryTypeInput.classList.add('entry-type-input');
        entryTypeInput.type = 'text';
        entryTypeInput.placeholder = 'e.g. Character, Location, Item';
        entryTypeLabel.appendChild(entryTypeInput);

        const entryNameLabel = document.createElement('label');
        entryNameLabel.textContent = 'Name:';
        const entryNameInput = document.createElement('input');
        entryNameInput.classList.add('entry-name-input');
        entryNameInput.type = 'text';
        entryNameInput.placeholder = 'e.g. John, New York, Sword of Destiny';
        entryNameLabel.appendChild(entryNameInput);

        const entryDescriptionLabel = document.createElement('label');
        entryDescriptionLabel.textContent = 'Description:';
        const entryDescriptionInput = document.createElement('textarea');
        entryDescriptionInput.classList.add('entry-description-input');
        entryDescriptionInput.placeholder = 'Enter description here...';
        entryDescriptionLabel.appendChild(entryDescriptionInput);

        // Add a delete button to the entry panel
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-entry-button');
        deleteButton.textContent = 'Delete';

        // Add an event listener to the delete button
        deleteButton.addEventListener('click', function(event) {
            if (confirm('Are you sure you want to delete this entry?')) {
                entryPanel.remove();
            }
        });

        // Populate the inputs if data is provided
        if (data) {
            entryTypeInput.value = data.type || '';
            entryNameInput.value = data.name || '';
            entryDescriptionInput.value = data.description || '';
        } else {
            entryTypeInput.value = '';
            entryNameInput.value = '';
            entryDescriptionInput.value = '';
        }

        if (data.type === 'click') {
            entryTypeInput.value = '';
        }

        entryPanel.appendChild(entryTypeLabel);
        entryPanel.appendChild(entryNameLabel);
        entryPanel.appendChild(entryDescriptionLabel);
        entryPanel.appendChild(deleteButton); // Append the delete button

        worldEntriesContainer.appendChild(entryPanel);
    }
        
    addWorldEntryButton.addEventListener('click', createWorldEntryPanel);

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
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 400) {
            value = 400;
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
    const resetAppearanceButton = document.getElementById('reset-appearance-button');

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

    // Function to remove color spans from the entire story editor content
    function removeColorSpans(storyEditor) {
        const spans = storyEditor.querySelectorAll('span[style*="color"]');
        spans.forEach(span => {
            const parent = span.parentNode;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });
    }

    // Function to apply the default appearance settings
    function applyDefaultAppearance() {
        lightModeRadio.checked = true;
        darkModeRadio.checked = false;
        applyTheme('light'); // Apply light theme

        fontSizeInput.value = 18;
        applyFontSize(18);

        fontFamilySelect.value = "'Source Sans Pro', sans-serif";
        applyFontFamily("'Source Sans Pro', sans-serif");

        textColorInput.value = "#c792ea";
        applyTextColor("#c792ea");

        saveAppearanceSettings(); // Save the default settings to localStorage
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
    // Add an event listener to the reset button
    resetAppearanceButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset appearance settings to default?')) {
            applyDefaultAppearance();
        }
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
                top_k: topK,
                world_entries: formData.world_entries
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
                        let data;
                        try {
                            data = JSON.parse(text);
                        } catch (err) {
                            // Ignore JSON parsing errors for now
                        }

                        if (response.status === 400 && data && data.cancelled) {
                            throw new Error('Generation cancelled by user.');
                        } else {
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
                    // Remove existing color spans
                    removeColorSpans(storyEditor);
    
                    // Trim whitespace from existing text content
                    let cleanedExistingText = storyEditor.innerHTML.replace(/ +/g, ' ');
    
                    // Ensure single space between existing and new text
                    if (!cleanedExistingText.endsWith(' ') && cleanedExistingText !== '') {
                        cleanedExistingText += ' ';
                    }
    
                    // Convert the new generated text to HTML with spans for color, using the selected text color
                    let newHtml = convertTextToHtml(result.generated_text, textColorInput.value);
    
                    // Append the new text
                    storyEditor.innerHTML = cleanedExistingText + newHtml;
    
                    // Save the story after the generated text has been added and trimmed
                    formData.story_content = storyEditor.innerHTML; // Update with new content
                    saveStory(formData.story_title, formData);
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
        text = text.replace(/\n+/g, '<br>&ensp;');
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