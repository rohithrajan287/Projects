FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the entire project
COPY . .

# Set command to run FastAPI from subfolder BE/
CMD ["uvicorn", "BE.main:app", "--host", "0.0.0.0", "--port", "8000"]
