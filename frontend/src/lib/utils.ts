import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const saveToLocalStorage = (key: string, value: string[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (key: string, defaultValue: unknown) => {
  const savedValue = localStorage.getItem(key);
  return savedValue ? JSON.parse(savedValue) : defaultValue;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const erroMessageHandler = (error: any) => {
  toast.error(error.message);
};
