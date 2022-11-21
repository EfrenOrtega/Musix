import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { Provider } from './context/Context'

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider>
    <App />
  </Provider>
);
