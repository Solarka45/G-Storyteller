import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, session, abort, send_from_directory
import os
import markdown
import secrets
import webbrowser
from threading import Timer
import sys

app = Flask(__name__, static_folder='static', template_folder='templates')

# Add this function to determine the base directory
def get_base_dir():
    if getattr(sys, 'frozen', False):
        # If the application is run as a bundle, the PyInstaller bootloader
        # extends the sys module by a flag frozen=True and sets the app
        # path into variable _MEIPASS'.
        base_dir = sys._MEIPASS
    else:
        base_dir = os.path.abspath(".")
    return base_dir

# Modify the static and template folder paths
app.static_folder = os.path.join(get_base_dir(), 'static')
app.template_folder = os.path.join(get_base_dir(), 'templates')

# Use this function to serve the static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

#app.secret_key = secrets.token_hex(16)

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

# Placeholder for API key validation - you'll need a more robust solution
def is_valid_api_key(api_key):
    return api_key is not None and len(api_key) > 0  # Replace with actual API key validation

# Function to get API key from file or form data
def get_api_key():
    api_key = None
    # Get the path to the user's Documents folder
    documents_path = os.path.join(os.path.expanduser("~"), "Documents")
    api_key_file_path = os.path.join(documents_path, 'api_key.txt')

    # Try to read API key from file
    if os.path.exists(api_key_file_path):
        try:
            with open(api_key_file_path, 'r') as f:
                api_key = f.read().strip()
                print("API key loaded from api_key.txt")  # Indicate that the key was loaded from the file
        except Exception as e:
            print(f"Error reading API key from file: {e}")

    # If API key is not found in the file, try to get it from the request data (if available)
    if not api_key:
        data = request.get_json()
        if data and 'api_key' in data:
            api_key = data.get('api_key')

    return api_key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    api_key = get_api_key()  # Use the get_api_key() function
    selected_model = data.get('selected_model')
    temperature = data.get('temperature')
    outputLength = data.get('outputLength')
    top_p = data.get('top_p')
    top_k = data.get('top_k')

    system_instruction = data.get('system_instruction')

    story_title = data.get('story_title')
    story_tags = data.get('story_tags')
    additional_details = data.get('additional_details')
    plot_direction = data.get('plot_direction')
    world_entries = data.get('world_entries')

    # Basic API key validation
    if not is_valid_api_key(api_key):
        return jsonify({'error': 'Invalid or missing API key'}), 400

    # Configure generativeai
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        return jsonify({'error': 'Error configuring API: ' + str(e)}), 500

    # Set up the model
    generation_config = {
        "temperature": temperature,
        "top_p": top_p,
        "top_k": top_k,
        "max_output_tokens": outputLength,
    }

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        },
    ]

    # In case any of the inputs are empty
    if (story_title == ""):
        story_title = "No Title"
    if (story_tags == ""):
        story_tags = "No Tags"
    if (additional_details == ""):
        additional_details = "No Additional Details"
    if (plot_direction == ""):
        plot_direction = "Up to you"
    if (world_entries == ""):
        world_entries = "No additional info entries."
    if (data.get('story_content') == ""):
        data['story_content'] = "Begin the story youself."
    if (system_instruction == ""):
        system_instruction = "Continue this story."

    model = genai.GenerativeModel(model_name=selected_model,
                                  generation_config=generation_config,
                                  safety_settings=safety_settings,
                                  system_instruction=system_instruction)

    # Prepare the prompt with system instructions
    prompt_parts = [
        "Story title:\n",
        story_title,
        "\nStory tags:\n",
        story_tags,
        "\nAdditional details for the story:\n",
        additional_details,
        "\nPlot direction:\n",
        plot_direction,
        "\nPrevious story text:\n",
        data.get('story_content'),
        "\nWorld entries:\n"
    ]

    # Add world entries to the prompt
    if world_entries:
        for entry in world_entries:
            prompt_parts.extend([
                f"Entry Type: {entry['type']}\n",
                f"Name: {entry['name']}\n",
                f"Description: {entry['description']}\n"
            ])
    
    # Add previous story text
    prompt_parts.extend([
        "\nPrevious story text:\n",
        data.get('story_content')
    ])

    # Print the prompt to the console for debugging
    # prompt = "".join(prompt_parts)
    # print("----- Prompt -----")
    # print(prompt)
    # print("-------------------")

    # Generate content
    try:
        response = model.generate_content(prompt_parts)
        # Return the generated text
        return jsonify({'generated_text': response.text})
    except genai.types.generation_types.StopCandidateException as e:
        return jsonify({'error': 'Operation cancelled by user.', 'cancelled': True}), 400
    except Exception as e:
        return jsonify({'error': 'Error generating content: ' + str(e)}), 500
    
@app.route('/cancel_generation', methods=['POST'])
def cancel_generation():
    # Check if the request is from an AJAX call
    if request.method == 'POST':
        # If it's an AJAX request, return a JSON response
        return jsonify({'message': 'Generation cancelled.', 'cancelled': True}), 200
    else:
        # If it's not an AJAX request, return the HTML page
        return render_template('index.html')

if __name__ == '__main__':
    print("Starting G Storyteller...")
    Timer(1, open_browser).start()
    app.run(debug=True)