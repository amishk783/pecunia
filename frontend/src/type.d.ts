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
  items: ItemType[];
}
export interface ItemType {
  allocatedBudget: number;
  amountBudget: number;
  groupId: number;
  id: number;
  label: string;
  type: string;
}

export interface BudgetsExitence {
  [key: string]: {
    [key: string]: number;
  };
}
