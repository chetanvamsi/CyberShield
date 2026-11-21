import "./ConfidenceBar.css";

/**
 * A horizontal probability bar. `isFlagged` switches the fill color between
 * the alert palette (cyberbullying) and the safe palette (not cyberbullying),
 * so tone always matches the verdict rather than a generic single accent.
 */
export default function ConfidenceBar({ confidence, isFlagged }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="confidence-bar">
      <div className="confidence-bar__labels">
        <span>Confidence</span>
        <span className="mono confidence-bar__value">{pct}%</span>
      </div>
      <div className="confidence-bar__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={"confidence-bar__fill" + (isFlagged ? " confidence-bar__fill--alert" : " confidence-bar__fill--safe")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
