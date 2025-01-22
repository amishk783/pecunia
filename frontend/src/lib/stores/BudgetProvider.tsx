import { BudgetType, GroupType } from "@/type";
import { create } from "zustand";

import api from "@/services/api";

import { notification } from "@/components/Notification";

interface BudgetStore {
  loading: boolean;
  budget: BudgetType | null;
  allExistedBudget: Record<number, Record<number, string>> | null;
  setBudget: (budget: BudgetType | null) => void;
  fetchAllExistedBudget: () => Promise<void>;
  addGroup: (group: GroupType) => void;
  reorderGroups: (groups: GroupType[]) => void;
  fetchBudget: (date: string) => Promise<void>;
}

export const useBudget = create<BudgetStore>()((set) => ({
  budget: null,
  loading: true,
  allExistedBudget: null,
  setBudget: (budget) => set({ budget }),
  fetchAllExistedBudget: async () => {
    try {
      set({ loading: true });
      const response = await api.get("app/budget/budgets");
      set({ allExistedBudget: response.data.budgetExitence });
    } catch (error) {
      notification({
        type: "error",
        message: "Failed to fetch all existed budget. Please try again.",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchBudget: async (date) => {
    set({ loading: true });
    try {
      const response = await api.post("/app/budget/by-date", {
        date,
      });

      set({ budget: response.data.currentBudget });
    } catch (error) {
      notification({
        type: "error",
        message: "Failed to fetch bugdet. Please try again.",
      });
    } finally {
      set({ loading: false });
    }
  },
  addGroup: (group) => {
    set((state) => {
      if (!state.budget) return state;
      const updatedGroups = [...state.budget.groups, group];
      return {
        budget: {
          ...state.budget,
          groups: updatedGroups,
        },
      };
    });
  },
  reorderGroups: (groups) => {
    set((state) => {
      if (!state.budget) return state;
      return {
        budget: {
          ...state.budget,
          groups,
        },
      };
    });
  },
}));
