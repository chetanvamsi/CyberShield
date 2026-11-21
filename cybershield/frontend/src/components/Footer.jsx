import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <p className="footer__text">
          CyberShield is a research prototype built for a machine-learning study on
          automated cyberbullying detection. It is not a moderation or legal tool.
        </p>
        <p className="footer__text footer__text--muted">
          © {new Date().getFullYear()} CyberShield research project.
        </p>
      </div>
    </footer>
  );
}
