import { apiUrls } from "@/lib/apiUrls";
import api from "./api";

export const cloneBudget = async (date: string, id: number) => {
  try {
    const res = await api.post(apiUrls.budget.cloneBudget(id), { date });

    return res.data.budget;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add category");
    }
    throw new Error(error.message || "An unexpected error occurred");
  }
};
