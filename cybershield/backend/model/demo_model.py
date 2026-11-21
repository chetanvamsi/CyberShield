"""
DemoDetector: a transparent, rule-based stand-in for the trained classifier.

This exists so the website is runnable end-to-end before a real model has
been trained on real data. It is deliberately simple and deliberately NOT
a machine-learning model -- it scores a small, visible list of abusive
terms and phrase patterns. Every response built from it is tagged
"is_demo": true so the frontend can (and does) label it "Demo Mode" rather
than presenting it as a research result. Swap in inference.py's
TrainedDetector once backend/models/cyberbullying_pipeline.joblib exists.
"""

import math
import re

from preprocessing.text_cleaner import clean_text

# Small, illustrative lexicon only -- NOT a research artifact and NOT the
# feature set a real model would use (a real model uses TF-IDF over the
# full training vocabulary, see model/train_model.py).
_HARASSMENT_TERMS = {
    "useless": 2.2, "worthless": 2.4, "hate": 1.8, "ugly": 1.6,
    "stupid": 1.8, "idiot": 2.0, "kill yourself": 3.5, "kys": 3.5,
    "loser": 1.8, "pathetic": 2.0, "nobody likes you": 2.6,
    "die": 1.9, "freak": 1.5, "disgusting": 1.7, "trash": 1.5,
    "dumb": 1.5, "shut up": 1.3, "nobody cares": 1.9, "fat": 1.1,
    "creep": 1.4, "loser": 1.8, "shame on you": 1.4,
}

_INTENSIFIERS = {"so", "very", "really", "extremely", "always", "such"}


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def predict(raw_text: str) -> dict:
    """
    Return a dict shaped like the real model's output, plus is_demo: true.

    {
      "prediction": "Cyberbullying" | "Not Cyberbullying",
      "confidence": float in [0, 1],
      "is_demo": True,
      "matched_terms": [...],
      "explanation": str
    }
    """
    cleaned = clean_text(raw_text, remove_stopwords=False, lemmatize=False)
    words = cleaned.split()

    score = 0.0
    matched = []

    for term, weight in _HARASSMENT_TERMS.items():
        if " " in term:
            if term in cleaned:
                score += weight
                matched.append(term)
        elif term in words:
            score += weight
            matched.append(term)

    intensifier_boost = sum(1 for w in words if w in _INTENSIFIERS) * 0.15
    score += intensifier_boost

    if re.search(r"[!]{2,}", raw_text):
        score += 0.3

    # Centered so 0-1 matched terms sits near the decision boundary.
    probability_bullying = _sigmoid(score - 1.6)
    is_bullying = probability_bullying >= 0.5

    confidence = probability_bullying if is_bullying else (1 - probability_bullying)

    if matched:
        explanation = (
            "Demo heuristic flagged " + ", ".join(f'"{m}"' for m in matched[:4]) +
            " as language commonly associated with harassment."
        )
    elif is_bullying:
        explanation = "Demo heuristic detected intensified negative phrasing."
    else:
        explanation = "Demo heuristic found no terms associated with harassment in its small reference list."

    return {
        "prediction": "Cyberbullying" if is_bullying else "Not Cyberbullying",
        "confidence": round(float(confidence), 4),
        "is_demo": True,
        "matched_terms": matched,
        "explanation": explanation,
    }
