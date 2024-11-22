import { apiUrls } from "@/lib/apiUrls";
import api from "./api";
import { Transaction } from "@/type";

export const getAllTransaction = async () => {
  try {
    const res = await api.get(apiUrls.expenses.all);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add category");
    }
    throw new Error(error.message || "An unexpected error occurred");
  }
};

export const addTransaction = async (data: Transaction) => {
  try {
    const res = await api.post(apiUrls.expenses.add, data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
