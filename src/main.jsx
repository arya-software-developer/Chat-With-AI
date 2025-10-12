import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import ChatContextProvider from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <ChatContextProvider>
    <App />
  </ChatContextProvider>
);
