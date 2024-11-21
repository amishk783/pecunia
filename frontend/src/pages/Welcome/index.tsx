import { Route, Routes } from "react-router-dom";
import {
  Lifestyle,
  Bill,
  Debt,
  Subscription,
  Goal,
  GuiltFreeExpense,
  HiddenExpense,
  OnboardingComplete,
} from "@/pages/Welcome/Onboarding";

const Welcome = () => {
  return (
    <>
      <Routes>
        <Route path="lifestyle" element={<Lifestyle />} />
        <Route path="bills" element={<Bill />} />
        <Route path="debt" element={<Debt />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="goals" element={<Goal />} />

        <Route path="guilt-free" element={<GuiltFreeExpense />} />
        <Route path="hidden-expense" element={<HiddenExpense />} />
        <Route path="submit" element={<OnboardingComplete />} />
      </Routes>
    </>
  );
};

export default Welcome;
