import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./lib/providers/AuthProvider.tsx";
import { FormProvider } from "./lib/providers/FormProvider.tsx";
import { ThemeProvider } from "./lib/providers/Theme.tsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FormProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </FormProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
