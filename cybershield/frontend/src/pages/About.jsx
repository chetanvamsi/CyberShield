import "./About.css";

export default function About() {
  return (
    <div className="section about">
      <div className="container about__inner">
        <p className="eyebrow">About the research</p>
        <h1>Detecting cyberbullying with NLP and classical ML</h1>

        <div className="about__block">
          <h2>Problem statement</h2>
          <p>
            Cyberbullying — repeated, targeted harassment carried out through digital
            platforms — is difficult to moderate at scale because volume far exceeds the
            capacity of human review. Comments containing insults, threats, or exclusionary
            language often go unaddressed until harm has already accumulated.
          </p>
        </div>

        <div className="about__block">
          <h2>Motivation</h2>
          <p>
            Automated screening does not need to be perfect to be useful: even a model that
            reliably surfaces likely-harmful comments for human review can meaningfully
            reduce response time and moderator workload. This project studies how well a
            classical NLP pipeline can perform that triage role on short, informal text.
          </p>
        </div>

        <div className="about__block">
          <h2>Objectives</h2>
          <ul>
            <li>Build a labeled-text classification pipeline for cyberbullying detection.</li>
            <li>Compare classical ML models (Logistic Regression, Naive Bayes, SVM, Random Forest) on the same features.</li>
            <li>Package the classifier behind an API that a frontend can call without knowing which model is deployed.</li>
            <li>Report precision/recall/F1 rather than accuracy alone, given class imbalance in harassment data.</li>
          </ul>
        </div>

        <div className="about__block">
          <h2>Proposed methodology</h2>

          <h3>NLP preprocessing</h3>
          <p>
            Raw text is lowercased, stripped of URLs and @mentions, hashtags are unwrapped
            to their base word, repeated characters are collapsed, and punctuation is
            removed. Stopwords are filtered and remaining tokens are lemmatized before
            vectorization.
          </p>

          <h3>Feature extraction</h3>
          <p>
            TF-IDF over unigrams and bigrams forms the baseline feature space (max 20,000
            features). This keeps the pipeline lightweight and interpretable — feature
            weights can be inspected directly, which matters for explaining individual
            predictions.
          </p>

          <h3>Machine-learning classification</h3>
          <p>
            Logistic Regression is the deployed baseline for its balance of accuracy and
            interpretability. Naive Bayes, Linear SVM, and Random Forest are trained on the
            same features for comparison (see Model Performance). A transformer-based model
            (BERT) is a planned extension once compute budget allows.
          </p>

          <h3>Model evaluation</h3>
          <p>
            Models are evaluated on a held-out test split using accuracy, precision, recall,
            F1-score, and a confusion matrix, rather than accuracy alone — harassment
            datasets are typically imbalanced, so recall on the minority class matters as
            much as overall accuracy.
          </p>
        </div>

        <div className="about__block">
          <h2>Limitations</h2>
          <ul>
            <li>TF-IDF has no notion of word order or context, so sarcasm and reclaimed language are hard to classify correctly.</li>
            <li>A model trained on one platform's data may not transfer well to another platform's tone or slang.</li>
            <li>Short, ambiguous messages ("just leave") can read as harassment or not depending on context the model never sees.</li>
            <li>The system is a screening aid, not an adjudicator — it should not be the sole basis for consequential decisions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
