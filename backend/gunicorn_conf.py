import os

workers = int(os.getenv("WEB_CONCURRENCY", "1"))
threads = int(os.getenv("PYTHON_MAX_THREADS", "1"))
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"
worker_class = "uvicorn.workers.UvicornWorker"
keepalive = 120
timeout = 120
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stdout
