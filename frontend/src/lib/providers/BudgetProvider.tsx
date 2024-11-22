import { BudgetType, BudgetsExitence } from "@/type";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { format } from "date-fns";
import api from "@/services/api";

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
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [allExistedBudget, setAllExistedBudget] = useState<Record<
    number,
    Record<number, string>
  > | null>(null);

  const { session } = useAuth();
  useEffect(() => {
    const fetchBudget = async () => {
      if (!session) return;
      const currentDate = new Date();
      const date = format(currentDate, "dd/MM/yyyy");
      setLoading(true);
      try {
        const response = await api.post("/app/budget/by-date", {
          date,
        });

        setBudget(response.data.currentBudget);
      } catch (error) {
        console.error("Error posting data:", error); // Handle the error
      } finally {
        setLoading(false);
      }
    };
    const fetchAllExistedBudget = async () => {
      if (!session) return;
      setLoading(true);
      try {
        const response = await api.get("app/budget/budgets");

        setAllExistedBudget(response.data.budgetExitence);
      } catch (error) {
        console.error("Error posting data:", error); // Handle the error
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
    fetchAllExistedBudget();
  }, [session]);
  return (
    <BudgetContext.Provider
      value={{ budget, setBudget, loading, allExistedBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
