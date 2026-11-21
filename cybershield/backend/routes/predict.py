"""
POST /predict

Request:  {"text": "user comment here"}
Response: {"prediction": "...", "confidence": 0.94, "is_demo": bool,
           "matched_terms": [...], "explanation": "..."}

Uses the trained model (model/inference.py) when USE_TRAINED_MODEL=true
and a saved pipeline exists at config.TRAINED_MODEL_PATH; otherwise falls
back to the transparent demo heuristic (model/demo_model.py). The response
always carries "is_demo" so the frontend can label the result correctly --
this endpoint never presents a demo guess as a trained-model result.
"""

from flask import Blueprint, jsonify, request

import config
from model import demo_model
from model.inference import load_trained_detector

predict_bp = Blueprint("predict", __name__)

_trained_detector = None
if config.USE_TRAINED_MODEL:
    _trained_detector = load_trained_detector(config.TRAINED_MODEL_PATH)
    if _trained_detector is None:
        print(
            "[predict] USE_TRAINED_MODEL=true but no saved pipeline was found at "
            f"{config.TRAINED_MODEL_PATH}. Falling back to the demo detector. "
            "Run model/train_model.py to create one."
        )

MAX_CHARS = 2000


@predict_bp.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "")

    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Field 'text' is required and must be a non-empty string."}), 400

    if len(text) > MAX_CHARS:
        return jsonify({"error": f"Text exceeds the {MAX_CHARS}-character limit."}), 400

    if _trained_detector is not None:
        result = _trained_detector.predict(text)
    else:
        result = demo_model.predict(text)

    return jsonify(result), 200
