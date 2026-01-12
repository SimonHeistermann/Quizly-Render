FROM python:3.12-slim

# Prevent Python from writing .pyc files (helps on some read-only FS setups)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

# -----------------------------
# System dependencies
# -----------------------------
# ffmpeg includes ffprobe (required by yt-dlp + Whisper)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     ffmpeg \
  && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Python dependencies (cached)
# -----------------------------
COPY requirements.txt ./
RUN pip install --upgrade pip \
  && pip install -r requirements.txt

# -----------------------------
# Whisper model preload (build-time)
# -----------------------------
# Cache path inside the image (keeps it stable & writable)
ENV WHISPER_DOWNLOAD_ROOT=/usr/src/app/.cache/whisper

RUN mkdir -p "$WHISPER_DOWNLOAD_ROOT" \
  && python -c "import os, whisper; whisper.load_model(os.getenv('WHISPER_MODEL', 'small'), download_root=os.getenv('WHISPER_DOWNLOAD_ROOT'))"

# -----------------------------
# App code
# -----------------------------
COPY . .

# -----------------------------
# Runtime
# -----------------------------
EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-8000} --timeout 300"]