import { apiUrls } from "@/lib/apiUrls";
import api from "./api";
import { notification } from "@/components/Notification";
import { AxiosError } from "axios";

interface GroupType {
  type: "expense" | "income";
  label: string;
  budgetId: number;
}

export const addGroup = async (data: GroupType) => {
  try {
    const res = await api.post(apiUrls.group.add, data);

    return res.data.group;
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

export const deleteGroup = async (id: number) => {
  try {
    const res = await api.delete(apiUrls.group.delete(id));

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

export const modifyGroup = async (id: number, label: string) => {
  try {
    const res = await api.put(apiUrls.group.modify(id), { label });

    return res.data.group;
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
export const reorderGroup = async (
  data: { id: number; position: number; budgetId: number }[]
) => {
  try {
    const res = await api.post(apiUrls.group.reorder, {
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
