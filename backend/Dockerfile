FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

# -----------------------------
# System dependencies
# -----------------------------
# ffmpeg includes ffprobe (yt-dlp + Whisper)
# nodejs/npm helps yt-dlp with some YouTube JS challenges (EJS)
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     ffmpeg \
     nodejs \
     npm \
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
# Keep it inside the image so runtime doesn't download it
ENV WHISPER_DOWNLOAD_ROOT=/usr/src/app/.cache/whisper
ENV WHISPER_MODEL=base

RUN mkdir -p "$WHISPER_DOWNLOAD_ROOT" \
  && python -c "import os, whisper; whisper.load_model(os.getenv('WHISPER_MODEL'), download_root=os.getenv('WHISPER_DOWNLOAD_ROOT'))"

# -----------------------------
# App code
# -----------------------------
COPY . .

EXPOSE 8000

# -----------------------------
# Runtime
# -----------------------------
# Use 1 worker to reduce memory spikes on small instances
CMD ["sh", "-c", "python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 1 --threads 2 --timeout 300"]