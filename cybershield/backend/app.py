"""
CyberShield backend entrypoint.

Run locally:
    cd backend
    pip install -r requirements.txt
    python app.py

Endpoints:
    GET  /health              liveness check
    POST /predict              {"text": "..."} -> prediction
    GET  /model-performance    dashboard metrics (demo or real, see config.py)
"""

import os

from flask import Flask, jsonify
from flask_cors import CORS

import config
from routes.predict import predict_bp
from routes.performance import performance_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, origins=config.CORS_ORIGINS)

    app.register_blueprint(predict_bp)
    app.register_blueprint(performance_bp)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ok",
            "using_trained_model": config.USE_TRAINED_MODEL,
        })

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
