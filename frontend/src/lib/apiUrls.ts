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
    scan: "/app/budget/transaction/scan",
    checkScanStatus: (id: string) => `/app/budget/transaction/scan/${id}`,
    copy: (id: number) => `/app/budget/transaction/copy/${id}`,
    all: "/app/budget/transaction",
    delete: (id: number) => `/app/budget/transaction/${id}`,
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
