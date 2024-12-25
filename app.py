import google.generativeai as genai
from flask import Flask, request, jsonify, render_template, session, abort
import os
import markdown
import secrets

app = Flask(__name__, static_folder='static', template_folder='.')

app.secret_key = secrets.token_hex(16)

# Placeholder for API key validation - you'll need a more robust solution
def is_valid_api_key(api_key):
    return api_key is not None and len(api_key) > 0  # Replace with actual API key validation

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    #api_key = data.get('api_key')
    api_key = "AIzaSyBAGd1Qb1z3Fc8hwPhc25WpDblrZDfAndA"
    #system_instruction = data.get('system_instruction')
    system_instruction = "You are a storywriter. You will continue the provided story. Do not repeat what was entered before unless it makes sense from narrative perspective."
    selected_model = data.get('selected_model')
    temperature = data.get('temperature')
    outputLength = data.get('outputLength')

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
        "top_p": 1,
        "top_k": 1,
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

    model = genai.GenerativeModel(model_name=selected_model,
                                  generation_config=generation_config,
                                  safety_settings=safety_settings,
                                  system_instruction=system_instruction)

    # Prepare the prompt with system instructions
    prompt_parts = [data.get('story_content')]

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