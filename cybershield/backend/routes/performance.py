"""
GET /model-performance

Returns whatever is currently in model/performance_store.json: demo
placeholder metrics until a real training run replaces the file (see
model/train_model.py), then real evaluation results after. The payload's
own "is_demo" flag tells the frontend which one it's looking at, so the
dashboard can label it correctly either way.
"""

import json
import os

from flask import Blueprint, jsonify

import config

performance_bp = Blueprint("performance", __name__)


@performance_bp.route("/model-performance", methods=["GET"])
def model_performance():
    if not os.path.exists(config.PERFORMANCE_DATA_PATH):
        return jsonify({"error": "No performance data available yet."}), 404

    with open(config.PERFORMANCE_DATA_PATH) as f:
        data = json.load(f)

    return jsonify(data), 200
