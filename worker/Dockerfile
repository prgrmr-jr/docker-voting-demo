FROM python:3.15.0a6-slim-trixie

WORKDIR /app

COPY worker.py requirements.txt ./

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y build-essential gcc \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

CMD ["python", "-u", "worker.py"]