"""
TrainedDetector: loads the real, trained pipeline (TF-IDF + classifier)
saved by train_model.py and produces predictions in the same response
shape as demo_model.predict(), but with "is_demo": False.

If no trained pipeline is found on disk, load_trained_detector() returns
None so app.py can fall back to the demo detector instead of crashing --
the API never silently pretends a missing model produced a real result.
"""

import os
import joblib
import numpy as np

from preprocessing.text_cleaner import clean_text


class TrainedDetector:
    def __init__(self, pipeline, label_names, model_name: str):
        self.pipeline = pipeline
        self.label_names = label_names  # e.g. {0: "Not Cyberbullying", 1: "Cyberbullying"}
        self.model_name = model_name

    def predict(self, raw_text: str) -> dict:
        cleaned = clean_text(raw_text)
        proba = self.pipeline.predict_proba([cleaned])[0]
        pred_idx = int(np.argmax(proba))
        prediction = self.label_names.get(pred_idx, str(pred_idx))
        confidence = float(proba[pred_idx])

        top_terms = self._top_contributing_terms(cleaned)
        if top_terms:
            explanation = (
                f"{self.model_name} weighted these terms most heavily: "
                + ", ".join(top_terms)
            )
        else:
            explanation = f"{self.model_name} found no strongly weighted terms in this input."

        return {
            "prediction": prediction,
            "confidence": round(confidence, 4),
            "is_demo": False,
            "matched_terms": top_terms,
            "explanation": explanation,
        }

    def _top_contributing_terms(self, cleaned_text: str, top_n: int = 4):
        """Best-effort: only works for linear models with a TF-IDF step named 'tfidf'."""
        try:
            vectorizer = self.pipeline.named_steps.get("tfidf")
            classifier = self.pipeline.named_steps.get("clf")
            if vectorizer is None or classifier is None or not hasattr(classifier, "coef_"):
                return []
            vec = vectorizer.transform([cleaned_text])
            coefs = classifier.coef_[0]
            feature_names = vectorizer.get_feature_names_out()
            nz_indices = vec.nonzero()[1]
            contributions = [(feature_names[i], vec[0, i] * coefs[i]) for i in nz_indices]
            contributions.sort(key=lambda pair: abs(pair[1]), reverse=True)
            return [term for term, _ in contributions[:top_n] if abs(_) > 0]
        except Exception:
            return []


def load_trained_detector(model_path: str):
    """Return a TrainedDetector, or None if no saved pipeline exists yet."""
    if not os.path.exists(model_path):
        return None
    try:
        bundle = joblib.load(model_path)
        return TrainedDetector(
            pipeline=bundle["pipeline"],
            label_names=bundle["label_names"],
            model_name=bundle.get("model_name", "Trained model"),
        )
    except Exception as exc:  # pragma: no cover
        print(f"[inference] Failed to load trained model at {model_path}: {exc}")
        return None
