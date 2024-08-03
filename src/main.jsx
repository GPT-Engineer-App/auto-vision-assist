import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Check for OpenAI API key
if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.error("OpenAI API key is not set. Please set the VITE_OPENAI_API_KEY environment variable.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
