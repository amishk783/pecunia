import { apiUrls } from "@/lib/apiUrls";
import api from "./api";
import { notification } from "@/components/Notification";
import { AxiosError } from "axios";

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
  } catch (error) {
    const message = (error as AxiosError<{ message: string }>).response?.data
      ?.message;

    notification({
      type: "error",
      message: `Error while posting Budget. ${message ?? ""}`,
    });

    throw error;
  }
};
export const deleteCategory = async (id: number) => {
  try {
    const res = await api.delete(apiUrls.category.delete(id));

    return res.data;
  } catch (error) {
    const message = (error as AxiosError<{ message: string }>).response?.data
      ?.message;

    notification({
      type: "error",
      message: `Error while posting Budget. ${message ?? ""}`,
    });

    throw error;
  }
};

export const reorderCategory = async (
  data: { id: number; position: number; groupId: number }[]
) => {
  try {
    const res = await api.post(apiUrls.category.reorder, {
      data,
    });

    return res.data;
  } catch (error) {
    const message = (error as AxiosError<{ message: string }>).response?.data
      ?.message;

    notification({
      type: "error",
      message: `Error while posting Budget. ${message ?? ""}`,
    });

    throw error;
  }
};
