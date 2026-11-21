import ConfidenceBar from "./ConfidenceBar.jsx";
import "./ResultCard.css";

export default function ResultCard({ result }) {
  if (!result) return null;

  const isFlagged = result.prediction === "Cyberbullying";

  return (
    <div className={"result-card" + (isFlagged ? " result-card--alert" : " result-card--safe")}>
      <div className="result-card__top">
        <div>
          <span className="result-card__badge">
            {isFlagged ? "Potential Cyberbullying Detected" : "No Cyberbullying Detected"}
          </span>
          {result.is_demo && <span className="result-card__demo-tag">Demo Mode</span>}
        </div>
      </div>

      <ConfidenceBar confidence={result.confidence} isFlagged={isFlagged} />

      <div className="result-card__explanation">
        <h3>Why this result</h3>
        <p>{result.explanation}</p>
        {result.matched_terms && result.matched_terms.length > 0 && (
          <div className="result-card__terms">
            {result.matched_terms.map((term) => (
              <span key={term} className="result-card__term mono">{term}</span>
            ))}
          </div>
        )}
      </div>

      {isFlagged && (
        <div className="result-card__action">
          <h3>Recommended action</h3>
          <ul>
            <li>Review the full conversation for context before deciding anything.</li>
            <li>Consider reporting the content through the platform's reporting tools.</li>
            <li>If someone is at risk, involve a trusted adult, moderator, or support service.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
