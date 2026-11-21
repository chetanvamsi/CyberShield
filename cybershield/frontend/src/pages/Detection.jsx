import { useState } from "react";
import { analyzeComment } from "../services/api.js";
import ResultCard from "../components/ResultCard.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import "./Detection.css";

const MAX_CHARS = 2000;

export default function Detection() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleAnalyze() {
    if (!text.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await analyzeComment(text);
      setResult(data);
      setStatus("done");
    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setErrorMsg(
        backendMsg ||
          "Couldn't reach the prediction service. Make sure the backend is running on the expected port."
      );
      setStatus("error");
    }
  }

  function handleClear() {
    setText("");
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  }

  return (
    <div className="section detection">
      <div className="container detection__grid">
        <div className="detection__input-col">
          <p className="eyebrow">Detection</p>
          <h1>Analyze a comment</h1>
          <p>
            Paste a comment or message below. CyberShield will estimate whether it reads
            as cyberbullying and explain what drove the result.
          </p>

          <div className="detection__textarea-wrap">
            <textarea
              className="detection__textarea"
              placeholder="Enter a comment or message to analyze…"
              value={text}
              maxLength={MAX_CHARS}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="detection__char-count mono">
              {text.length} / {MAX_CHARS}
            </div>
          </div>

          <div className="detection__actions">
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={!text.trim() || status === "loading"}
            >
              {status === "loading" ? "Analyzing…" : "Analyze Comment"}
            </button>
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          </div>

          <div className="detection__disclaimer">
            <Disclaimer compact />
          </div>
        </div>

        <div className="detection__result-col">
          {status === "loading" && <LoadingState />}
          {status === "error" && (
            <div className="detection__error">
              <h3>Couldn't get a result</h3>
              <p>{errorMsg}</p>
            </div>
          )}
          {status === "done" && result && <ResultCard result={result} />}
          {status === "idle" && (
            <div className="detection__placeholder">
              <p>Your result will appear here once you analyze a comment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="detection__loading">
      <div className="detection__spinner" aria-hidden="true" />
      <p>Analyzing text…</p>
    </div>
  );
}
