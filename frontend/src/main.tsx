import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

// import { AuthProvider } from "./lib/providers/AuthProvider.tsx";
import { FormProvider } from "./lib/stores/FormProvider.tsx";
import { ThemeProvider } from "./lib/stores/Theme.tsx";

import "./index.css";

import { ExpenseProvier } from "./lib/stores/ExpenseProvier.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ExpenseProvier>
        <FormProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </FormProvider>
      </ExpenseProvier>
    </BrowserRouter>
  </React.StrictMode>
);
