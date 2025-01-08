import { BudgetType } from "@/type";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { format } from "date-fns";
import api from "@/services/api";
import { useAuth } from "./AuthProvider";

import { notification } from "@/components/Notification";

interface BudgetContextType {
  budget: BudgetType | null;
  setBudget: React.Dispatch<React.SetStateAction<BudgetType | null>>;
  loading: boolean | null;
  allExistedBudget: Record<number, Record<number, string>> | null;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [allExistedBudget, setAllExistedBudget] = useState<Record<
    number,
    Record<number, string>
  > | null>(null);

  const { isAuth } = useAuth();

  useEffect(() => {
    const fetchAllExistedBudget = async () => {
      try {
        if (!isAuth) return;
        setLoading(true);
        const response = await api.get("app/budget/budgets");

        setAllExistedBudget(response.data.budgetExitence);
      } catch (error) {
        // Handle the error
        notification({
          type: "error",
          message: "Failed to fetch all existed bugdet. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllExistedBudget();
  }, [isAuth]);

  const value = useMemo(
    () => ({ budget, setBudget, loading, allExistedBudget }),
    [budget, setBudget, loading, allExistedBudget]
  );

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
