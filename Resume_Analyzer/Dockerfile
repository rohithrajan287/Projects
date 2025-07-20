# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy only the backend code and its requirements
COPY ./Resume_Analyzer/be /app/be
COPY ./Resume_Analyzer/be/requirements.txt /app/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Set the working directory to the backend application's root
WORKDIR /app/be

# Expose the port (Railway will map this internally)
EXPOSE 8000 # Or any port you prefer, just ensure Uvicorn uses it

# Command to run the FastAPI application using Uvicorn
# Important: $PORT is injected by Railway and your app must listen on it.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
# ^^^^^ IMPORTANT: 'main:app' assumes your FastAPI instance is
# named 'app' in 'main.py' within your 'be' folder.
# If your file is 'api.py' and app is 'fastapi_app', it would be 'api:fastapi_app'