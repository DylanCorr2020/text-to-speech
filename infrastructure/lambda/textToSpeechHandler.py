
# Import standard and AWS SDK libraries
import json          # (Optional here) used for handling JSON-formatted data
import boto3         # AWS SDK for Python – used to interact with AWS services
import os            # Used to work with environment variables and file paths
from urllib.parse import unquote_plus


# Create AWS service clients
s3 = boto3.client('s3')        # S3 client for reading and writing files
polly = boto3.client('polly')  # Polly client for text-to-speech synthesis

def lambda_handler(event, context):
    """
    AWS Lambda entry point. Triggered automatically when a new .txt file
    is uploaded to the input S3 bucket.
    """

    # --- Extract event information from the S3 trigger ---
    # Each S3-triggered Lambda event includes a 'Records' array.
    # Here we assume one file upload per event.
    record = event['Records'][0]

    # Get the bucket name and object key (file name) from the event
    source_bucket = record['s3']['bucket']['name']   # Input bucket name
    #key = record['s3']['object']['key']              # File key (e.g., 'story.txt')
    key = unquote_plus(record['s3']['object']['key']) 
    print(f"Triggered by bucket: {source_bucket}, key: {key}")


    # Get the destination (output) bucket name from the Lambda environment variable
    output_bucket = os.environ['OUTPUT_BUCKET']

    # --- Download the uploaded text file to temporary local storage (/tmp) ---
    # Lambda has only 512 MB of /tmp space for temporary files during execution.
    tmp_path = f"/tmp/{os.path.basename(key)}"
    s3.download_file(source_bucket, key, tmp_path)

    # --- Read the text content from the downloaded file ---
    with open(tmp_path, 'r') as f:
        text = f.read()

    # --- Use Amazon Polly to synthesize speech from the text ---
    # Polly converts the text into spoken audio and returns an MP3 audio stream.
    response = polly.synthesize_speech(
        Text=text,             # The text content to convert
        OutputFormat='mp3',    # Audio output format
        VoiceId='Joanna'       # Voice selection (e.g., Joanna, Matthew, Amy, etc.)
    )

    # --- Define the name and path for the new MP3 file ---
    # Replace .txt with .mp3 and store it in the temporary directory.
    audio_key = os.path.splitext(key)[0] + ".mp3"
    #audio_path = f"/tmp/{audio_key}"
    audio_path = f"/tmp/{os.path.basename(audio_key)}"

    # --- Save the audio stream returned by Polly to a local MP3 file ---
    with open(audio_path, 'wb') as f:
        f.write(response['AudioStream'].read())

    # --- Upload the MP3 file to the output S3 bucket ---
    s3.upload_file(audio_path, output_bucket, audio_key)

    # --- Log a confirmation message for CloudWatch ---
    print(f"Audio file saved to {output_bucket}/{audio_key}")