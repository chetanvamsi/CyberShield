import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <section className="section hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">Machine learning research project</p>
            <h1>Screening social text for cyberbullying, before it escalates.</h1>
            <p className="hero__lede">
              CyberShield analyzes a single comment or message and estimates whether it
              reads as harassment — surfacing a confidence score and a plain-language
              reason, so a person can make the final call quickly.
            </p>
            <div className="hero__actions">
              <Link to="/detect" className="btn btn-primary">Analyze a comment</Link>
              <Link to="/about" className="btn btn-ghost">How it works</Link>
            </div>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <ScanIllustration />
          </div>
        </div>
      </section>

      <section className="section section--tight how">
        <div className="container">
          <h2>How the system works</h2>
          <ol className="how__steps">
            <li>
              <span className="how__index mono">01</span>
              <div>
                <h3>Preprocess</h3>
                <p>The text is lowercased, stripped of URLs and mentions, and normalized so the model sees consistent input.</p>
              </div>
            </li>
            <li>
              <span className="how__index mono">02</span>
              <div>
                <h3>Vectorize &amp; classify</h3>
                <p>A TF-IDF representation feeds a trained classifier, which outputs a probability of harassment.</p>
              </div>
            </li>
            <li>
              <span className="how__index mono">03</span>
              <div>
                <h3>Explain &amp; review</h3>
                <p>The result ships with a confidence score and a short explanation, framed as a screening signal for a human to review.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section--tight benefits">
        <div className="container benefits__grid">
          <div>
            <h2>Why a screening layer helps</h2>
            <p>
              Manually reading every comment doesn't scale. A lightweight first pass helps
              moderators and researchers prioritize what to look at first — without
              replacing their judgment.
            </p>
          </div>
          <ul className="benefits__list">
            <li>
              <strong>Faster triage.</strong> Surface likely-harmful comments first instead of reading a feed in order.
            </li>
            <li>
              <strong>Transparent reasoning.</strong> Every result includes the terms or patterns that drove it.
            </li>
            <li>
              <strong>Model-agnostic backend.</strong> The classifier can be swapped (Logistic Regression, SVM, BERT) without touching the interface.
            </li>
            <li>
              <strong>Built for research.</strong> Metrics and dataset details stay visible instead of hidden behind a black box.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function ScanIllustration() {
  return (
    <svg viewBox="0 0 420 380" className="scan-illustration">
      <defs>
        <linearGradient id="scanline" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1F6F63" stopOpacity="0" />
          <stop offset="0.5" stopColor="#1F6F63" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1F6F63" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d="M210 20L60 72V190C60 265 122 320 210 348C298 320 360 265 360 190V72L210 20Z"
        fill="none" stroke="#1F6F63" strokeWidth="2" opacity="0.5" />

      <g fontFamily="Inter, sans-serif" fontSize="13" fill="#46524C">
        <rect x="95" y="95" width="150" height="26" rx="5" fill="#FFFFFF" stroke="#D8DED8" />
        <text x="107" y="112">"you're so annoying"</text>

        <rect x="130" y="145" width="150" height="26" rx="5" fill="#FFFFFF" stroke="#D8DED8" />
        <text x="142" y="162">"great job today!"</text>

        <rect x="90" y="195" width="165" height="26" rx="5" fill="#FFFFFF" stroke="#B5402A" />
        <text x="102" y="212" fill="#B5402A">"nobody likes you"</text>

        <rect x="140" y="245" width="140" height="26" rx="5" fill="#FFFFFF" stroke="#D8DED8" />
        <text x="152" y="262">"see you tomorrow"</text>
      </g>

      <rect x="50" y="60" width="320" height="60" fill="url(#scanline)">
        <animate attributeName="y" values="60;280;60" dur="6s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
