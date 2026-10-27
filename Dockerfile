# ==============================================================================
# OmniCare CDS — Production Dockerfile
# AWS CDS Agentic AI Partner Hackathon 2026
# ==============================================================================

FROM python:3.12-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application files (with pre-built frontend)
COPY . /app

# Ensure data dir exists
RUN mkdir -p /app/data

ENV PYTHONPATH=/app \
    PORT=8000 \
    PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
