import { Route, Routes, Navigate, Outlet } from "react-router-dom";

import { useTheme } from "./lib/providers/Theme.tsx";
import { cn } from "@/lib/utils.ts";

import Budget from "@/pages/Budget";
import Layout from "./Layout.tsx";
import Dashboard from "@/pages/Dashboard";
import Expenses from "@/pages/Expenses";
import Goals from "@/pages/Goals";
import { LogIn } from "lucide-react";
import Login from "@/pages/Auth/Login.tsx";
import Signup from "@/pages/Auth/Signup.tsx";
import { Sign } from "crypto";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";

function App() {
  const { theme } = useTheme();
  const bgcolor = `bg-[${theme?.bgColor}]`;

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="app/"
          element={
            <main className={cn("w-full h-full", bgcolor)}>
              <Outlet />
            </main>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Budget />} />
          <Route path="users" element={<Expenses />} />
          <Route path="account" element={<Goals />} />
          <Route path="budget" element={<Budget />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
