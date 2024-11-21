import { apiUrls } from "@/lib/apiUrls";
import api from "./api";

export interface ItemDataType {
  label: string;
  type: string;
  groupId: number;
  amountBudget: number;
}

export const addCategory = async (data: ItemDataType) => {
  try {
    const res = await api.post(apiUrls.category.add, data);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add category");
    }
    throw new Error(error.message || "An unexpected error occurred");
  }
};
export const deleteCategory = async (id: number) => {
  try {
    const res = await api.delete(apiUrls.category.delete(id));

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add category");
    }
    throw new Error(error.message || "An unexpected error occurred");
  }
};
