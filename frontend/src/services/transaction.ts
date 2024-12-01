import { apiUrls } from "@/lib/apiUrls";
import api from "./api";
import { Transaction } from "@/type";
import { notification } from "@/components/Notification";
import { AxiosError } from "axios";

export const getAllTransaction = async () => {
  try {
    const res = await api.get(apiUrls.expenses.all);

    return res.data;
  } catch (error) {
    const message = (error as AxiosError<{ message: string }>).response?.data
      ?.message;

    notification({
      type: "error",
      message: ` ${message ?? "Error while getting transactions"}.`,
    });

    throw error;
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

export const deleteTransaction = async (id: number) => {
  try {
    const res = await api.delete(apiUrls.expenses.delete(id));

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const copyTransaction = async (data: Transaction, id: number) => {
  try {
    const res = await api.post(apiUrls.expenses.copy(id), data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadReceipt = async (image: File) => {
  console.log("🚀 ~ uploadReceipt ~ image:", image);
  try {
    const formData = new FormData();
    formData.append("image", image);
    const res = await api.post(apiUrls.expenses.scan, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const checkScanStatus = async (id: string) => {
  try {
    const res = await api.post(apiUrls.expenses.checkScanStatus(id));

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
