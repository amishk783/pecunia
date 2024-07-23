import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const saveToLocalStorage = (key: string, value: string[]) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadFromLocalStorage = (
  key: string,
  defaultValue:unknown
) => {
  const savedValue = localStorage.getItem(key);
  return savedValue ? JSON.parse(savedValue) : defaultValue;
};
