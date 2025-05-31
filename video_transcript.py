from google import genai
from google.genai import types


video_url = 'https://www.youtube.com/watch?v=9hE5-98ZeCg'

# prompt = '''Analyze the following YouTube video content.
#             Provide a concise summary with the detail breakdown of different topics 
#             that are covered in the video along with the timestamps.'''

prompt = """
ROLE:
You are a YouTube content professional. You are very competent and able to come up with catchy names for the different sections of video transcripts that are submitted to you.
CONTEXT:
This is a YouTube video
INSTRUCTION:
Analyze the following YouTube video content.
Provide a concise summary with the detail breakdown of different topics 
that are covered in the video along with the timestamps.
FORMAT:
<TIMESTAMP> <CATCHY SECTION TITLE>
OUTPUT:
""".strip()

client = genai.Client(api_key=GOOGLE_API_KEY)

response = client.models.generate_content(
    model='models/gemini-2.0-flash',
    contents=types.Content(
        parts=[
            types.Part(
                file_data=types.FileData(file_uri=video_url)
            ),
            types.Part(text=prompt)
        ]
    )
)

print(response.text)