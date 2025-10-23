import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Main from "./components/Main/Main.jsx";
import ChatContextProvider from "./context/ChatContext.jsx";
import "./index.css";
import { chatLoader } from "./utilities/chatLoader.js";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Main /> },
      { path: ":id", element: <Main />, loader: chatLoader },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <ChatContextProvider>
    <RouterProvider router={routes}></RouterProvider>
  </ChatContextProvider>
);
