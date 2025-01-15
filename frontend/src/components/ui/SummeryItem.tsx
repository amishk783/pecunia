import React from "react";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

import { Skeleton } from "./skeleton";

interface Props {
  title: string;
  amount: number;
  loading?: boolean;
  iconColor?: string;
  symbol?: string;
  iconShow?: boolean;
  className?: string;
}

export const SummeryItem: React.FC<Props> = ({
  title,
  symbol = "$",
  amount,
  loading = false,
  iconShow,

  className,
}) => {
  console.log("🚀 ~ isLoading:", loading);

  return (
    <div
      className={cn(
        "flex  h-full w-full text-lg bg-background rounded-md  px-4 py-6  lg:min-w-80  ",
        className
      )}
    >
      {loading ? (
        <div className="flex flex-col w-1/2 gap-6 ">
          <Skeleton className="h-4  rounded-xl bg-card-foreground/20" />
          <Skeleton className="h-4 w-1/2  rounded-xl " />
        </div>
      ) : (
        <div className="flex flex-col gap-6 ">
          {iconShow && <CalendarPlus className="" />}
          <div className=" flex flex-col gap-2">
            <h2 className=" text-secondary-foreground/70 font-semibold">
              {title}
            </h2>
            <p className=" text-opacity-100 text-2xl font-extrabold">
              {symbol} {amount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
