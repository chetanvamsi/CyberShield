import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { getModelPerformance } from "../services/api.js";
import "./Performance.css";

export default function Performance() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    getModelPerformance()
      .then((payload) => {
        setData(payload);
        const firstReal = Object.keys(payload.models || {}).find(
          (name) => payload.models[name].accuracy != null
        );
        setSelectedModel(firstReal || null);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div className="section container">
        <p>Loading model performance…</p>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="section container">
        <h1>Model performance</h1>
        <p>Couldn't reach the backend. Make sure the Flask server is running.</p>
      </div>
    );
  }

  const chartData = Object.entries(data.models)
    .filter(([, m]) => m.accuracy != null)
    .map(([name, m]) => ({
      name,
      Accuracy: m.accuracy,
      Precision: m.precision,
      Recall: m.recall,
      "F1 Score": m.f1_score,
    }));

  const selected = selectedModel ? data.models[selectedModel] : null;

  return (
    <div className="section performance">
      <div className="container">
        <div className="performance__header">
          <div>
            <p className="eyebrow">Model performance</p>
            <h1>How the classifiers compare</h1>
          </div>
          {data.is_demo && <span className="performance__demo-tag">Demo Data</span>}
        </div>

        <p className="performance__note">
          {data.is_demo
            ? "These figures are placeholder values shown for layout purposes — no model has been trained on a real dataset yet. Run backend/model/train_model.py on a labeled dataset to replace them."
            : `Evaluated on a held-out test split of ${data.dataset_size} labeled examples (${Math.round((data.test_size || 0) * 100)}% test size).`}
        </p>

        <div className="performance__chart">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid stroke="#D8DED8" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#46524C" }} />
              <YAxis domain={[0, 1]} tick={{ fontSize: 12, fill: "#46524C" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Accuracy" fill="#1F6F63" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Precision" fill="#3F7A4E" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Recall" fill="#B5402A" radius={[3, 3, 0, 0]} />
              <Bar dataKey="F1 Score" fill="#46524C" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="performance__table-wrap">
          <table className="performance__table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.models).map(([name, m]) => (
                <tr key={name} className={name === data.deployed_model ? "performance__row--deployed" : ""}>
                  <td>{name}{name === data.deployed_model && <span className="performance__deployed-tag">Deployed</span>}</td>
                  <td className="mono">{m.accuracy ?? "—"}</td>
                  <td className="mono">{m.precision ?? "—"}</td>
                  <td className="mono">{m.recall ?? "—"}</td>
                  <td className="mono">{m.f1_score ?? "—"}</td>
                  <td>
                    {m.confusion_matrix && (
                      <button className="performance__cm-btn" onClick={() => setSelectedModel(name)}>
                        View matrix
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && selected.confusion_matrix && (
          <ConfusionMatrix name={selectedModel} matrix={selected.confusion_matrix} />
        )}
      </div>
    </div>
  );
}

function ConfusionMatrix({ name, matrix }) {
  const [[tn, fp], [fn, tp]] = matrix;
  const cells = [
    { label: "True negative", value: tn, kind: "safe" },
    { label: "False positive", value: fp, kind: "alert" },
    { label: "False negative", value: fn, kind: "alert" },
    { label: "True positive", value: tp, kind: "safe" },
  ];

  return (
    <div className="confusion-matrix">
      <h3>Confusion matrix — {name}</h3>
      <div className="confusion-matrix__grid">
        {cells.map((cell) => (
          <div key={cell.label} className={`confusion-matrix__cell confusion-matrix__cell--${cell.kind}`}>
            <span className="confusion-matrix__value mono">{cell.value}</span>
            <span className="confusion-matrix__label">{cell.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
