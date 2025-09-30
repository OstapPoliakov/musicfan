import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app/ui/App/App";
import { BrowserRouter } from "react-router";
import { store } from "./app/model/store";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
