import React from "react";
import { CalendarPlus } from "lucide-react";
interface Props {
  title: string;
  amount: number;
  iconColor?: string;
  iconShow?: boolean;
  className?: string;
}

export const SummeryItem: React.FC<Props> = ({ title, amount }) => {
  return (
    <div className="flex  h-min min-w-80  border rounded-2xl">
      <div className="flex flex-col gap-6 px-4 py-6">
        <CalendarPlus className="" />
        <div className=" flex flex-col gap-2">
          <h2 className=" text-lg font-semibold">{title}</h2>
          <p className=" text-2xl font-extrabold">{amount}</p>
        </div>
      </div>
    </div>
  );
};
