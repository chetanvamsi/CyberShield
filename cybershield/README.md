# CyberShield — AI-Based Cyberbullying Detection

A research prototype for a machine-learning study on automated cyberbullying
detection. A user submits a comment or message; the backend returns a
prediction (Cyberbullying / Not Cyberbullying), a confidence score, and a
plain-language explanation. Every result is explicitly framed as an
AI-assisted screening signal, not a definitive judgment.

## Project structure

```text
cybershield/
├── frontend/           React (Vite) app — 5 pages, calls the backend API
│   ├── src/
│   │   ├── pages/       Home, Detection, About, Performance, Dataset
│   │   ├── components/  Navbar, Footer, ResultCard, ConfidenceBar, Disclaimer
│   │   └── services/     api.js (axios client)
├── backend/             Flask API
│   ├── app.py            entrypoint: /health, /predict, /model-performance
│   ├── model/
│   │   ├── demo_model.py      transparent keyword heuristic (Demo Mode)
│   │   ├── inference.py       loads a real trained pipeline, if one exists
│   │   ├── train_model.py     trains + evaluates LR/NB/SVM/RandomForest on your CSV
│   │   └── performance_store.json   dashboard data (demo placeholders until you train)
│   ├── preprocessing/text_cleaner.py   shared cleaning, used at train + inference time
│   └── routes/           predict.py, performance.py
├── dataset/             put your labeled CSV here (see dataset/README.md)
├── models/               train_model.py saves the deployable pipeline here
├── notebooks/            optional EDA / experiments
```

## Demo Mode vs. a real trained model

The site is runnable immediately without any dataset:

- **Demo Mode** (default): `/predict` uses `backend/model/demo_model.py`, a
  small, transparent keyword-and-pattern heuristic. Every response it
  produces is tagged `"is_demo": true`, and the frontend labels results
  accordingly ("Demo Mode" badge). It is not a machine-learning model and
  is not a research result — it exists only so the app has something to
  show before training.
- **Real model**: once you have a labeled dataset (see `dataset/README.md`),
  run `backend/model/train_model.py` to train and compare Logistic
  Regression, Naive Bayes, Linear SVM, and Random Forest on TF-IDF
  features, save the best pipeline to `models/cyberbullying_pipeline.joblib`,
  and write real accuracy/precision/recall/F1/confusion-matrix numbers to
  `backend/model/performance_store.json`. Then start the backend with
  `USE_TRAINED_MODEL=true` so `/predict` uses the trained pipeline instead.

The `Model Performance` and `Dataset & Methodology` pages always show
whichever data is currently in `performance_store.json`, and they label it
"Demo Data" until you replace it — nothing here is presented as a research
finding until you've actually produced one.

## Running locally

### 1. Backend (Flask)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API runs on `http://localhost:5000` by default. Check it with:

```bash
curl http://localhost:5000/health
```

### 2. Frontend (React + Vite)

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

If your backend runs on a different host/port, create `frontend/.env` with:

```
VITE_API_BASE_URL=http://localhost:5000
```

### 3. (Optional) Train a real model

```bash
cd backend
python model/train_model.py --csv ../dataset/your_data.csv --text-col text --label-col label
USE_TRAINED_MODEL=true python app.py
```

## API reference

**POST `/predict`**

```json
// Request
{ "text": "You are useless, nobody likes you." }

// Response
{
  "prediction": "Cyberbullying",
  "confidence": 0.94,
  "is_demo": true,
  "matched_terms": ["useless", "nobody likes you"],
  "explanation": "Demo heuristic flagged ..."
}
```

**GET `/model-performance`** — returns whatever is in `performance_store.json`
(demo placeholders or real evaluation results), including an `is_demo` flag.

**GET `/health`** — `{ "status": "ok", "using_trained_model": false }`

## Notes for the research paper

- Keep the "Limitations" section on the About page in sync with what you
  actually observe once real data is trained on — TF-IDF's known blind spots
  (sarcasm, context, cross-platform transfer) are listed as expected
  limitations, not hedging.
- `performance_store.json`'s `is_demo` flag is the single source of truth for
  whether the numbers on screen are placeholders or real results — don't
  hand-edit the "demo" numbers and call them findings.
- The dataset page's statistics are intentionally left as configuration
  placeholders (`DATASET_STATS` in `frontend/src/pages/Dataset.jsx`) rather
  than invented numbers; fill them in once a dataset is finalized.
