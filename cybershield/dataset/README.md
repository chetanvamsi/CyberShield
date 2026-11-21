# Dataset

This folder is where you place the labeled dataset used to train the real
classifier (see `../backend/model/train_model.py`).

## Expected format

A CSV with at least two columns:

| column  | description                                      |
|---------|---------------------------------------------------|
| `text`  | the raw comment / message                         |
| `label` | `1` for cyberbullying, `0` for not cyberbullying   |

Column names are configurable via `--text-col` / `--label-col` when running
`train_model.py`, so you don't need to rename an existing dataset's columns.

## Suggested public sources (verify license/terms before use)

- Formspring / Twitter cyberbullying datasets used in academic literature
  on the topic (search for the specific paper's data release).
- Kaggle's cyberbullying / hate-speech classification datasets.
- Any institutionally-approved dataset if this is for a university project —
  check with your advisor about ethics/IRB requirements before using
  real social-media data, even if publicly posted.

Do not commit a real dataset with personally identifiable information to a
public repository. Add your dataset file to `.gitignore` if it's not already
covered.
