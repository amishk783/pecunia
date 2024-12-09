import React from "react";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
interface Props {
  title: string;
  amount: number;
  iconColor?: string;
  iconShow?: boolean;
  className?: string;
}

export const SummeryItem: React.FC<Props> = ({
  title,
  amount,
  iconShow,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex  h-full w-full text-lg bg-theme-primary rounded-md   md:min-w-80  ",
        className
      )}
    >
      <div className="flex flex-col gap-6 px-4 py-6">
        {iconShow && <CalendarPlus className="" />}
        <div className=" flex flex-col gap-2">
          <h2 className=" text-primary/70 font-semibold">{title}</h2>
          <p className=" text-opacity-100 text-2xl font-extrabold">{amount}</p>
        </div>
      </div>
    </div>
  );
};
