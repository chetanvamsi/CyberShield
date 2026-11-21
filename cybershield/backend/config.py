"""
Central configuration for the CyberShield backend.

Nothing in this file is a research result. MODEL_PERFORMANCE_DEMO holds
placeholder numbers ONLY so the dashboard has something to render before a
real model has been trained and evaluated. Replace the values in
model/performance_store.json (or point PERFORMANCE_DATA_PATH at your own
evaluation export) once real experiments exist -- do not edit the numbers
below and call them results.
"""

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Toggle this once backend/models/cyberbullying_pipeline.joblib exists
# (see model/train_model.py). While False, /predict uses the transparent,
# clearly-labeled keyword-heuristic DemoDetector instead of a trained model.
USE_TRAINED_MODEL = os.environ.get("USE_TRAINED_MODEL", "false").lower() == "true"

TRAINED_MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    os.path.join(BASE_DIR, "..", "models", "cyberbullying_pipeline.joblib"),
)

# Where /model-performance reads its metrics from. Swap this file for a real
# evaluation export (see model/train_model.py) once you have one -- the
# frontend already renders whatever is_demo / metrics it finds here.
PERFORMANCE_DATA_PATH = os.path.join(BASE_DIR, "model", "performance_store.json")

CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
