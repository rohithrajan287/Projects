FROM python:3.10-slim

WORKDIR /app

COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY uploads/ ./uploads/
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
