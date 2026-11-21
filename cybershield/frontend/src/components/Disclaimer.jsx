import "./Disclaimer.css";

export default function Disclaimer({ compact = false }) {
  return (
    <div className={"disclaimer" + (compact ? " disclaimer--compact" : "")}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="disclaimer__icon">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="12" cy="15.6" r="0.9" fill="currentColor" />
      </svg>
      <p>
        This is an AI-assisted screening result, not a definitive judgment. The model can
        be wrong in both directions — always have a human review flagged content before
        taking action.
      </p>
    </div>
  );
}
