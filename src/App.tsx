import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useTheme } from "./lib/providers/Theme.tsx";
import { cn } from "@/lib/utils.ts";

import Budget from "@/pages/Budget";
import Layout from "./Layout.tsx";
import Dashboard from "@/pages/Dashboard";
import Expenses from "@/pages/Expenses";
import Goals from "@/pages/Goals";
import Login from "@/pages/Auth/Login.tsx";
import Signup from "@/pages/Auth/Signup.tsx";
import ForgotPassword from "@/pages/Auth/ForgotPassword.tsx";
import PrivateRoute from "./lib/PrivateRoute.tsx";
import UpdatePassword from "./pages/Auth/UpdatePassword.tsx";
import Welcome from "./pages/Welcome/index.tsx";
import CustomThemePicker from "./components/CustomThemePicker.tsx";

function App() {
  const { theme,themePicker,setThemeOpen } = useTheme();
  const bgcolor = `bg-[${theme?.bgColor}]`;

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/welcome/*" element={<Welcome />} />
        <Route element={<PrivateRoute />}>
          <Route path="/update-password" element={<UpdatePassword />} />
        </Route>

        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route index element={<Navigate to="app/dashboard" replace />} />
          </Route>
          <Route
            path="app/"
            element={
              <main className={cn("w-full h-full relative", bgcolor)}>
                {themePicker && <CustomThemePicker handleOpen={setThemeOpen} />}
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
    </>
  );
}

export default App;
