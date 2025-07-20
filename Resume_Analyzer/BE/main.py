from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import shutil
import os

app = FastAPI()

origins = [
    "https://your-frontend-railway-url.railway.app", # Replace with your actual frontend URL
    "http://localhost:3000" # For local development
]

# Enable CORS for all origins (you can restrict this later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running."}

import os

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    upload_dir = os.path.join(os.getcwd(), "uploads")  # absolute path
    os.makedirs(upload_dir, exist_ok=True)

    file_location = os.path.join(upload_dir, file.filename)
    print(f"Saving file to: {file_location}")

    with open(file_location, "wb") as f:
        contents = await file.read()
        f.write(contents)

    print("File saved successfully")
    return {"message": "File uploaded successfully"}


@app.post("/ask")
async def ask_question(question: str = Form(...)):
    # Simulated answer logic — replace with actual resume processing later
    print("Query==",question)
    answer = f"This is a dummy answer to your question: {question}"
    return {"answer": answer}
