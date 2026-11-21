"""
Shared text-preprocessing pipeline.

Used by both the demo heuristic and the real TF-IDF + Logistic Regression
model, so that swapping one for the other never changes how raw text is
normalized. Keeping this in one module is what lets model/train_model.py
and model/demo_model.py stay in sync.
"""

import re
import string

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer

    _NLTK_AVAILABLE = True
except ImportError:  # pragma: no cover
    _NLTK_AVAILABLE = False


_STOPWORDS = None
_LEMMATIZER = None


def _ensure_nltk_resources():
    """Download NLTK data on first use only, and fail soft."""
    global _STOPWORDS, _LEMMATIZER
    if not _NLTK_AVAILABLE:
        return
    if _STOPWORDS is not None:
        return
    for pkg in ("stopwords", "wordnet", "omw-1.4"):
        try:
            nltk.data.find(f"corpora/{pkg}")
        except LookupError:
            try:
                nltk.download(pkg, quiet=True)
            except Exception:
                pass
    try:
        _STOPWORDS = set(stopwords.words("english"))
        _LEMMATIZER = WordNetLemmatizer()
    except Exception:
        _STOPWORDS = set()
        _LEMMATIZER = None


URL_RE = re.compile(r"https?://\S+|www\.\S+")
MENTION_RE = re.compile(r"@\w+")
HASHTAG_RE = re.compile(r"#(\w+)")
MULTISPACE_RE = re.compile(r"\s+")
REPEATED_CHARS_RE = re.compile(r"(.)\1{2,}")


def clean_text(text: str, remove_stopwords: bool = True, lemmatize: bool = True) -> str:
    """
    Normalize a raw comment before feature extraction.

    Steps: lowercase -> strip URLs/mentions -> unwrap hashtags -> collapse
    repeated characters ("soooo" -> "soo") -> strip punctuation -> collapse
    whitespace -> optional stopword removal -> optional lemmatization.

    This mirrors the preprocessing used when training the TF-IDF vectorizer,
    so text sent through /predict is normalized identically at train and
    inference time.
    """
    if not isinstance(text, str):
        return ""

    text = text.lower()
    text = URL_RE.sub(" ", text)
    text = MENTION_RE.sub(" ", text)
    text = HASHTAG_RE.sub(r"\1", text)
    text = REPEATED_CHARS_RE.sub(r"\1\1", text)
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = MULTISPACE_RE.sub(" ", text).strip()

    if not (remove_stopwords or lemmatize):
        return text

    _ensure_nltk_resources()
    tokens = text.split()

    if remove_stopwords and _STOPWORDS:
        tokens = [t for t in tokens if t not in _STOPWORDS]

    if lemmatize and _LEMMATIZER:
        tokens = [_LEMMATIZER.lemmatize(t) for t in tokens]

    return " ".join(tokens)
