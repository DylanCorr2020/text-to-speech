# 📄 Notes to Audio — Serverless Text-to-Speech App

A serverless web application that converts written study notes into spoken audio using **Amazon Polly**.  
Users upload text-based files, select a voice, and automatically receive an MP3 version they can listen to anywhere.

---




## 🧠 What This Project Does

- Upload `.txt`, `.docx`, or `.html` files
- Convert notes into audio using Amazon Polly
- Choose different voices before upload
- Secure user authentication
- Automatically generate and play audio files

The entire system is event-driven and runs without managing servers.

---

## 🏗️ Architecture (High Level)

<img width="1194" height="536" alt="Image" src="https://github.com/user-attachments/assets/37be2320-1062-46ee-8193-114eb63c0ef0" />

## 🧰 Why These AWS Services?

### Amazon S3

- Hosts the static React frontend
- Stores uploaded text files
- Stores generated MP3 audio files
- Highly durable, scalable, and cost-effective

### Amazon CloudFront

- Provides fast, global access to the frontend
- Integrates seamlessly with S3 static hosting

### Amazon Cognito

- Handles user authentication securely
- Ensures users only access their own files
- Integrates easily with AWS Amplify

### AWS Lambda (Python)

- Automatically processes uploaded text files
- Converts text to speech without managing servers
- Scales automatically based on usage

### Amazon Polly

- Converts text into natural-sounding speech
- Supports multiple voices and accents
- Ideal for text-to-audio workflows

---

## ⚙️ Key Design Choice

Voice selection is passed from the frontend to the backend using **S3 object metadata**, allowing the Lambda function to remain stateless and event-driven.

---

## 🚀 Why Serverless?

- No infrastructure to manage
- Scales automatically
- Pay only for what you use
- Ideal for media processing pipelines

---

## 📖 Documentation & Demo

- Full technical walkthrough: [Read the Medium article](https://medium.com/p/79e15c67f2ca/edit)

## 👤 Author

Built by **Dylan**
