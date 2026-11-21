"""
Train and evaluate cyberbullying-detection classifiers on a real, labeled
dataset (see ../../dataset/README.md for the expected CSV format).

This script does three things and does not fabricate any of them:
  1. Loads your CSV, splits train/test, fits a TF-IDF vectorizer.
  2. Trains and evaluates several classical models (Logistic Regression,
     Naive Bayes, Linear SVM, Random Forest), so you can compare them
     instead of committing to one blindly.
  3. Saves the best pipeline to ../../models/cyberbullying_pipeline.joblib
     and writes REAL accuracy/precision/recall/F1/confusion-matrix numbers
     to performance_store.json, replacing the demo placeholders.

Usage:
    cd backend
    python model/train_model.py --csv ../dataset/comments.csv \
        --text-col text --label-col label

The CSV must have a text column and a binary label column (1 = cyberbullying,
0 = not). Adjust --text-col / --label-col to match your dataset's headers.
"""

import argparse
import json
import os
import sys

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.text_cleaner import clean_text  # noqa: E402

LABEL_NAMES = {0: "Not Cyberbullying", 1: "Cyberbullying"}

MODELS = {
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
    "Naive Bayes": MultinomialNB(),
    "Linear SVM": CalibratedClassifierCV(LinearSVC(class_weight="balanced")),
    "Random Forest": RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42),
}


def load_dataset(csv_path: str, text_col: str, label_col: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    if text_col not in df.columns or label_col not in df.columns:
        raise ValueError(
            f"CSV must contain '{text_col}' and '{label_col}' columns. Found: {list(df.columns)}"
        )
    df = df[[text_col, label_col]].dropna()
    df.columns = ["text", "label"]
    df["label"] = df["label"].astype(int)
    return df


def evaluate(model, X_test_vec, y_test) -> dict:
    preds = model.predict(X_test_vec)
    cm = confusion_matrix(y_test, preds).tolist()
    return {
        "accuracy": round(float(accuracy_score(y_test, preds)), 4),
        "precision": round(float(precision_score(y_test, preds, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, preds, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, preds, zero_division=0)), 4),
        "confusion_matrix": cm,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True, help="Path to labeled dataset CSV")
    parser.add_argument("--text-col", default="text")
    parser.add_argument("--label-col", default="label")
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-state", type=int, default=42)
    parser.add_argument("--best-model-for-deploy", default="Logistic Regression",
                         choices=list(MODELS.keys()))
    args = parser.parse_args()

    here = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(here)
    project_root = os.path.dirname(backend_dir)

    print(f"Loading dataset from {args.csv} ...")
    df = load_dataset(args.csv, args.text_col, args.label_col)
    print(f"Loaded {len(df)} labeled rows.")

    print("Cleaning text ...")
    df["clean_text"] = df["text"].apply(clean_text)

    X_train, X_test, y_train, y_test = train_test_split(
        df["clean_text"], df["label"], test_size=args.test_size,
        random_state=args.random_state, stratify=df["label"],
    )

    vectorizer = TfidfVectorizer(max_features=20000, ngram_range=(1, 2), min_df=2)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    results = {}
    fitted_models = {}
    for name, model in MODELS.items():
        print(f"Training {name} ...")
        model.fit(X_train_vec, y_train)
        metrics = evaluate(model, X_test_vec, y_test)
        results[name] = metrics
        fitted_models[name] = model
        print(f"  {name}: accuracy={metrics['accuracy']} f1={metrics['f1_score']}")

    performance_payload = {
        "is_demo": False,
        "dataset_size": int(len(df)),
        "test_size": args.test_size,
        "models": results,
        "deployed_model": args.best_model_for_deploy,
    }

    performance_path = os.path.join(here, "performance_store.json")
    with open(performance_path, "w") as f:
        json.dump(performance_payload, f, indent=2)
    print(f"\nWrote real evaluation metrics to {performance_path}")

    deploy_model = fitted_models[args.best_model_for_deploy]
    deploy_pipeline = Pipeline([("tfidf", vectorizer), ("clf", deploy_model)])

    os.makedirs(os.path.join(project_root, "models"), exist_ok=True)
    model_out_path = os.path.join(project_root, "models", "cyberbullying_pipeline.joblib")
    joblib.dump(
        {
            "pipeline": deploy_pipeline,
            "label_names": LABEL_NAMES,
            "model_name": args.best_model_for_deploy,
        },
        model_out_path,
    )
    print(f"Saved deployable pipeline ({args.best_model_for_deploy}) to {model_out_path}")
    print("\nSet USE_TRAINED_MODEL=true when starting the backend to use it:")
    print("  USE_TRAINED_MODEL=true python app.py")


if __name__ == "__main__":
    main()
