import "./Dataset.css";

// Configurable placeholders -- edit these to match the dataset you actually
// use. Nothing here is a claimed research result; it's the shape of the
// page, waiting for real numbers.
const DATASET_STATS = {
  totalSamples: "—",
  classes: ["Cyberbullying", "Not Cyberbullying"],
  trainSplit: "80%",
  testSplit: "20%",
  source: "Not yet finalized",
};

export default function Dataset() {
  return (
    <div className="section dataset">
      <div className="container dataset__inner">
        <p className="eyebrow">Dataset &amp; methodology</p>
        <h1>What the model is trained on</h1>
        <p>
          The values below are configuration placeholders, not reported results. Fill in
          backend/model/train_model.py's dataset path and rerun it to populate this page
          and the Model Performance dashboard with real numbers.
        </p>

        <div className="dataset__stats">
          <StatCard label="Total samples" value={DATASET_STATS.totalSamples} />
          <StatCard label="Classes" value={DATASET_STATS.classes.join(" / ")} />
          <StatCard label="Train split" value={DATASET_STATS.trainSplit} />
          <StatCard label="Test split" value={DATASET_STATS.testSplit} />
        </div>

        <div className="dataset__block">
          <h2>Data preprocessing</h2>
          <p>
            Text is lowercased, URLs and @mentions are stripped, hashtags are unwrapped,
            repeated characters are collapsed, punctuation is removed, stopwords are
            filtered, and remaining tokens are lemmatized. The same function
            (<code>preprocessing/text_cleaner.py</code>) runs at both training and
            inference time so the two never drift apart.
          </p>
        </div>

        <div className="dataset__block">
          <h2>Feature representation</h2>
          <p>
            TF-IDF over unigrams and bigrams, capped at 20,000 features, with a minimum
            document frequency of 2 to drop one-off noise terms. Swapping to dense
            embeddings (e.g. sentence-transformers) for a deep-learning comparison is a
            straightforward extension of the same pipeline.
          </p>
        </div>

        <div className="dataset__block">
          <h2>Algorithms compared</h2>
          <ul>
            <li>Logistic Regression — deployed baseline</li>
            <li>Multinomial Naive Bayes</li>
            <li>Linear SVM (calibrated for probability outputs)</li>
            <li>Random Forest</li>
            <li>LSTM / BERT — planned, not yet trained</li>
          </ul>
        </div>

        <div className="dataset__block">
          <h2>Evaluation metrics</h2>
          <p>
            Accuracy, precision, recall, F1-score, and a confusion matrix, computed on a
            held-out test split. Precision/recall are reported rather than accuracy alone
            because harassment datasets are typically imbalanced.
          </p>
        </div>

        <div className="dataset__block">
          <h2>Source</h2>
          <p>{DATASET_STATS.source} — update this section once a specific labeled dataset has been selected and cited.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-card__value mono">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}
