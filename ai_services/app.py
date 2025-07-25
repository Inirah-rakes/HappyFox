import os
import requests
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import google.generativeai as genai
import json
import ast


load_dotenv()
app = Flask(__name__)
CORS(app)

YOUTUBE_API_KEY = 'AIzaSyCIYacMl84QvdZYRSOB1UUm2oAFnHwX5Xw'
MAX_RESULTS = 5
MIN_LIKES = 1000

def search_videos(query):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        'part': 'snippet',
        'q': query,
        'type': 'video',
        'maxResults': MAX_RESULTS,
        'key': YOUTUBE_API_KEY,
        'order': 'viewCount'
    }
    response = requests.get(url, params=params)
    return response.json().get('items', [])

def get_video_details(video_ids):
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        'part': 'snippet,statistics',
        'id': ','.join(video_ids),
        'key': YOUTUBE_API_KEY
    }
    response = requests.get(url, params=params)
    return response.json().get('items', [])

@app.route('/recommend-videos', methods=['POST'])
def recommend_videos():
    data = request.get_json()
    weak_topics = data.get('topics', [])

    if not weak_topics:
        return jsonify({'error': 'No topics provided'}), 400

    query = ", ".join(weak_topics)
    results = search_videos(query)
    video_ids = [item['id']['videoId'] for item in results if 'videoId' in item['id']]

    video_details = get_video_details(video_ids)
    recommendations = []

    for video in video_details:
        stats = video.get('statistics', {})
        likes = int(stats.get('likeCount', 0))

        if likes >= MIN_LIKES:
            recommendations.append({
                'title': video['snippet']['title'],
                'url': f"https://www.youtube.com/watch?v={video['id']}",
                'thumbnail': video['snippet']['thumbnails']['high']['url']
            })

        if len(recommendations) >= 3:
            break
    print("Recommendations:", recommendations)  # Debugging line

    return jsonify({'videos': recommendations})





@app.route('/')
def hello_world():
    return 'Hello, AI backend here!'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    input_text = data.get('text', '')
    result = f"Predicted sentiment for '{input_text}' is: Positive"
    return jsonify({'result': result})

@app.route('/placeholder', methods=['POST'])
def placeholder():
    return jsonify({'message': 'This is a placeholder endpoint.'})

def format_student_data_for_prompt(details):
    """Helper function to convert the student JSON into a clean string for the AI prompt."""
    text = f"Personal Info: {details.get('personalInfo', {})}\n"
    text += f"Contact Info: {details.get('contactInfo', {})}\n"
    text += f"Summary: {details.get('summary', '')}\n"
    text += f"Education: {details.get('education', [])}\n"
    text += f"Skills: {details.get('skills', {})}\n"
    text += f"Projects: {details.get('projects', [])}\n"
    text += f"Experience: {details.get('experience', [])}\n"
    text += f"Achievements: {details.get('achievements', [])}\n"
    return text

def get_video_id(youtube_url):
    match = re.search(r"(?:v=|\/)([a-zA-Z0-9_-]{11})(?:$|\?|&)", youtube_url)
    return match.group(1) if match else None

def chunk_text(text, max_words=500):
    words = text.split()
    return [' '.join(words[i:i+max_words]) for i in range(0, len(words), max_words)]

def get_summary(text):
    client = InferenceClient(
        provider="hf-inference",
        api_key=os.environ.get("HF_TOKEN"),
    )
    result = client.summarization(
        text,
        model="facebook/bart-large-cnn"
    )
    return result['summary_text']

@app.route('/youtube-transcript', methods=['POST'])
def get_youtube_transcript():
    link = request.get_json().get('link')
    video_id = get_video_id(link)

    if video_id:
        try:
            transcript_obj = YouTubeTranscriptApi().fetch(video_id)
            # Access the .snippets list and extract text from each snippet
            full_text = " ".join([snippet.text for snippet in transcript_obj.snippets])

            # 🔁 Chunk the text if it's too long
            chunks = chunk_text(full_text, max_words=500)
            summaries = [get_summary(chunk) for chunk in chunks]

            combined_summary = "\n".join(summaries)

            return jsonify({
                'transcript': full_text,
                'summary': combined_summary
            })

        except Exception as e:
            return jsonify({'error': f'Error fetching transcript: {str(e)}'}), 500
    else:
        return jsonify({'error': 'No Caption found or Invalid YouTube URL provided.'}), 400

# def get_summary(text):
#     client = InferenceClient(
#     provider="hf-inference",
#     api_key=os.environ.get("HF_TOKEN"),
#     )

#     result = client.summarization(text,
#     model="facebook/bart-large-cnn",
#     )
#     return result

# @app.route('/youtube-transcript', methods=['POST'])
# def get_youtube_transcript():
#     link = request.get_json().get('link')
#     video_id = get_video_id(link)

#     if video_id:
#       try:
#           transcript_obj = YouTubeTranscriptApi().fetch(video_id)
#           # Access the .snippets list and extract text from each snippet
#           full_text = " ".join([snippet.text for snippet in transcript_obj.snippets])
#           transcript_summary = get_summary(full_text)
#           return jsonify({'transcript': full_text,'summary': transcript_summary['summary_text']})
#       except Exception as e:
#           return jsonify({'error': f'Error fetching transcript: {str(e)}'}), 500
#     else:
#           return jsonify({'error': 'No Caption found or Invalid YouTube URL provided.'}), 400

# def search_videos(query):
#     url = f"https://www.googleapis.com/youtube/v3/search"
#     params = {
#         'part': 'snippet',
#         'q': query,
#         'type': 'video',
#         'maxResults': 10,
#         'key': os.environ.get('YOUTUBE_API_KEY'),
#         'order': 'viewCount'
#     }
#     response = requests.get(url, params=params)
#     return response.json().get('items', [])

# def get_video_details(video_ids):
#     url = f"https://www.googleapis.com/youtube/v3/videos"
#     params = {
#         'part': 'snippet,statistics',
#         'id': ','.join(video_ids),
#         'key': os.environ.get('YOUTUBE_API_KEY')
#     }
#     response = requests.get(url, params=params)
#     return response.json().get('items', [])

###
"""
need to define the function to call 
above ones to get list of search_videos
""" 
###


def extract_json_from_markdown(text):
    """
    Extracts JSON block from Gemini's Markdown-style ```json ... ``` response.
    """
    # Match code block like ```json\n....\n```
    match = re.search(r"```json\n([\s\S]+?)\n```", text)
    if match:
        return match.group(1).strip()
    return text.strip()

model = genai.GenerativeModel("gemini-2.0-flash")

def generate_mcqs_with_gemini(summary):
    prompt = f"""
You are an AI assistant that creates quiz questions for learners.

Based on the summary below, generate 5 multiple choice questions in the following JSON format:

[
  {{
    "question": "...",
    "options": {{
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    }},
    "correct_answer": "B",
    "topic": "..."  // e.g., "Recursion", "Hash Table", etc.
  }},
  ...
]

### Summary:
{summary}
"""

    try:
        response = model.generate_content(prompt)
        print("Response from Gemini:", response)  # Debugging line
        raw_text = response.text.strip()
        cleaned_text = extract_json_from_markdown(raw_text)
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            return ast.literal_eval(cleaned_text)
        # ⚠️ Only safe if you trust your input/output
    except Exception as e:
        return [{"error": "Failed to parse MCQs", "details": str(e)}]

@app.route('/generate-mcq', methods=['POST'])
def generate_mcq():
    data = request.get_json()
    summary = data.get('summary')

    if not summary:
        return jsonify({'error': 'Summary not provided'}), 400

    mcqs = generate_mcqs_with_gemini(summary)
    return jsonify(mcqs)

@app.route("/generate-roadmap", methods=["POST"])
def generate_roadmap():
    data = request.get_json()

    name = data.get("name", "Student")
    year = data.get("yearOfStudy", "1")
    role = data.get("dreamRole", "")
    passions = data.get("passions", "")
    tech = data.get("technicalSkills", "")
    behavior = data.get("behavioralTraits", "")
    industries = data.get("preferredIndustries", "")
    learning = data.get("learningStyle", "")

    prompt = f"""
You are a career mentor. Based on the following student details, generate a personalized career roadmap in a timeline manner, semester-by-semester or year-wise.

Use simple, friendly tone. For early year students, include exploration and fundamentals. For final year students, focus on internships, job readiness, and projects.

Return a detailed and structured plan (as plain text) with headers like:
- Year/Semester
- What to focus on
- Suggested tools/resources
- Practical tips

Student Info:
- Name: {name}
- Year of Study: {year}
- Dream Role: {role}
- Passions: {passions}
- Current Technical Skills: {tech}
- Behavioral Traits: {behavior}
- Preferred Industries: {industries}
- Learning Style: {learning}
    """

    try:
        response = model.generate_content(prompt)
        return jsonify({"roadmap": response.text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate-resume-ai', methods=['POST'])
def generate_resume_with_gemini():
    """
    Receives student profile data, sends it to the Gemini API,
    and returns an AI-generated resume.
    """
    data = request.get_json()
    if not data or 'studentDetails' not in data:
        return jsonify({'error': 'Missing studentDetails in request body'}), 400

    student_details = data['studentDetails']
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return jsonify({'error': 'GEMINI_API_KEY not found in environment variables.'}), 500

    formatted_details = format_student_data_for_prompt(student_details)
    prompt = f"""

    As a professional resume writer, analyze the following student data and generate a structured and ats friendly resume.

    **IMPORTANT**: You MUST respond with only a single JSON object. Do not add any introductory text or markdown formatting like ```json. The JSON object should follow this exact structure:

    {{
      "fullName": "string",
      "professionalTitle": "string",
      "contact": {{
        "email": "string",
        "phone": "string",
        "linkedin": "string",
        "github": "string"
      }},
      "summary": "string",
      "sections": [
        {{
          "title": "SKILLS",
          "type": "categorized_list",
          "content": {{
            "Programming Languages": ["string", "string"],
            "Frameworks": ["string", "string"],
            "Databases": ["string", "string"],
            "Tools": ["string", "string"]
          }}
        }},
        {{
          "title": "EXPERIENCE",
          "type": "itemized_list",
          "content": [
            {{
              "heading": "string",
              "subheading": "string",
              "date": "string",
              "points": ["string", "string"]
            }}
          ]
        }},
        {{
          "title": "PROJECTS",
          "type": "itemized_list",
          "content": [
            {{
              "heading": "string",
              "subheading": "string",
              "points": ["string", "string"]
            }}
          ]
        }},
        {{
          "title": "EDUCATION",
          "type": "itemized_list",
          "content": [
            {{
              "heading": "string",
              "subheading": "string",
              "date": "string",
              "points": ["string"]
            }}
          ]
        }},
        {{
          "title": "ACHIEVEMENTS",
          "type": "simple_list",
          "content": ["string", "string"]
        }}
      ]
    }}

    Here is the Student Data:
    ---
    {formatted_details}
    ---
    """

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status() 
        
        result = response.json()
        
        if 'candidates' in result and result['candidates']:
            generated_text = result['candidates'][0]['content']['parts'][0]['text']
            return jsonify({'generated_resume_text': generated_text.strip()})
        else:
            return jsonify({'error': 'Failed to generate resume. The API response was empty or malformed.', 'details': result}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'An error occurred while calling the Gemini API: {e}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)
