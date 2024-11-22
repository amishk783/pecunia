export const apiUrls = {
  user: {},
  auth: {
    signup: "",
    signin: "",
  },
  category: {
    add: "/app/item",
    modify: "",
    reorder: "/app/budget/item/reorder",
    delete: (id: number) => `/app/item/${id}`,
  },
  group: {
    add: "/app/budget/group/",
    modify: (id: number) => `/app/budget/group/${id}`,
    reorder: "/app/budget/group/reorder",
    delete: (id: number) => `/app/budget/group/${id}`,
  },
  expenses: {
    add: "/app/budget/transaction",
    edit: "",
    all: "/app/budget/transaction",
    getExpenses: ({ from, to }: { from: string; to: string }) =>
      `/api/expenses?from=${from}&to=${to}`,
  },
  income: {
    add: "/api/income/add",
    modify: "/api/income",
    reorder: "",
  },
  budget: {
    cloneBudget: (id: number) => `/app/budget/${id}`,
  },
};
