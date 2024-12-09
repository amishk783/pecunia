export interface BudgetType {
  id: number;
  month: number;
  status: string;
  year: number;
  groups: GroupType[];
}

export interface GroupType {
  budgetID: number;
  id: number;
  label: string;
  type: "expense" | "income";
  position: number;
  items: ItemType[];
}
export interface ItemType {
  allocatedBudget: string;
  amountBudget: string;
  groupId: number;
  id: number;
  label: string;
  type: string;
  position: number;
}

export interface BudgetsExitence {
  [key: string]: {
    [key: string]: number;
  };
}

export type Transaction = {
  id?: string;
  amount: number | string;
  date: string | Date;
  label: string;
  category: string;
  paidVia: string;
  notes?: string;
};
export type PendingTransactionType = {
  sessionId: string;
  label: string;
  billImageUrl: File;
  status: string;
};
