import { apiUrls } from "@/lib/apiUrls";
import api from "./api";
import { AxiosError } from "axios";
import { notification } from "@/components/Notification";

export const cloneBudget = async (date: string, id: number) => {
  try {
    const res = await api.post(apiUrls.budget.cloneBudget(id), { date });

    return res.data.budget;
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
