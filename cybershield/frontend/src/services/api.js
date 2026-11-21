import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * Send a comment to the backend for classification.
 * @param {string} text
 * @returns {Promise<{prediction: string, confidence: number, is_demo: boolean, matched_terms: string[], explanation: string}>}
 */
export async function analyzeComment(text) {
  const { data } = await client.post("/predict", { text });
  return data;
}

/**
 * Fetch dashboard metrics (demo or real -- payload's own is_demo flag says which).
 */
export async function getModelPerformance() {
  const { data } = await client.get("/model-performance");
  return data;
}
