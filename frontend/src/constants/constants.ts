import { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";

import { Bitcoin } from "lucide-react";
import { SquareGanttChart } from "lucide-react";
export interface DashboardType {
  icon: LucideIcon;
  text: string;
  pathUrl: string;
}

export const adminDashboard: DashboardType[] = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    pathUrl: "app/dashboard",
  },

  {
    icon: Bitcoin,
    text: "Budget",
    pathUrl: "app/budget",
  },
  {
    icon: SquareGanttChart,
    text: "Expenses",
    pathUrl: "app/expenses",
  },
];

interface ExpensesPayMode {
  [key: string]: {
    name: string;
    emoji: string;
  };
}

export const expensesPayMode: ExpensesPayMode = {
  cash: { name: "Cash", emoji: "💵" },
  creditcard: { name: "Credit Card", emoji: "💳" },
  debitcard: { name: "Debit Card", emoji: "💳" },
  ewallet: { name: "E-Wallet", emoji: "🪪" },
  netbanking: { name: "NetBanking", emoji: "🏦" },
  upi: { name: "UPI", emoji: "📲" },
};

export interface GroupWithCategoriesType {
  [key: string]: {
    name: string;
  }[];
}

export const defaultAvatarUrls = [
  "/avatar1.jpg",
  "/avatar2.jpg",
  "/avatar3.jpg",
  "/avatar4.jpg",
  "/avatar5.jpg",
  "/avatar6.jpg",
];
