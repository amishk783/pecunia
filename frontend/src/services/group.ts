import { apiUrls } from "@/lib/apiUrls";
import api from "./api";

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
    console.log(error);
  }
};

export const deleteGroup = async (id: number) => {
  try {
    const res = await api.delete(apiUrls.group.delete(id));

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const modifyGroup = async (id: number, label: string) => {
  try {
    const res = await api.put(apiUrls.group.modify(id), { label });

    return res.data.group;
  } catch (error) {
    console.log(error);
  }
};
