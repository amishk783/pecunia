import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useTheme } from "./lib/providers/Theme.tsx";
import SideBar from "./components/SideBar.tsx";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header.tsx";
import { ThemeProvider } from "./lib/providers/Theme.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <div className="flex absolute z-[-1]  bg-bgtest bg-no-repeat bg-center bg-cover bg-opacity-40 w-full h-full bg-blend-soft-light bg-zinc-600 ">
          <div className=""></div>
          <SideBar />
          <div className="flex flex-col w-full ">
            <Header />
            <App />
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
