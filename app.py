import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, session, abort
import os
import markdown
import secrets
from pathlib import Path

app = Flask(__name__, static_folder='static', template_folder='.')

app.secret_key = secrets.token_hex(16)

# Placeholder for API key validation - you'll need a more robust solution
def is_valid_api_key(api_key):
    return api_key is not None and len(api_key) > 0  # Replace with actual API key validation

# Function to get API key from file or form data
def get_api_key():
    api_key = None
    # Get the path to the user's Documents folder
    documents_path = str(Path.home() / "Documents")
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
        data.get('story_content')
    ]

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
    app.run(debug=True)