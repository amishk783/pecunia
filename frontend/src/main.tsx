import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./lib/providers/AuthProvider.tsx";
import { FormProvider } from "./lib/providers/FormProvider.tsx";
import { ThemeProvider } from "./lib/providers/Theme.tsx";

import "./index.css";
import { BudgetProvider } from "./lib/providers/BudgetProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FormProvider>
          <BudgetProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </BudgetProvider>
        </FormProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
