import { PendingTransactionType } from "@/type";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

import { AddExpense } from "./add";
import { useState } from "react";

export const PendingTransaction: React.FC<PendingTransactionType> = ({
  sessionId,
  label,
  billImageUrl,
  status,
  partialTransaction,
}) => {
  console.log("🚀 ~ label:", label);
  console.log(new Date());
  console.log("🚀 ~ sessionId:", partialTransaction);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <div className="p-2 w-auto min-h-12 rounded-md bg-theme-primary">
      <div className=" flex items-center gap-4">
        {/* <h2>{label}</h2> */}
        {billImageUrl && (
          <img
            className="w-20 h-20"
            src={URL.createObjectURL(billImageUrl)}
            alt="pending image"
          />
        )}
        {status === "PROCESSING" && (
          <Loader2 className="w-10 h-10 animate-spin" />
        )}
        {status === "COMPLETED" && (
          <div className="flex items-center flex-col">
            <p className=" text-lg  text-green-300">Scan Completed</p>
            <Button onClick={() => setIsOpenEdit(true)}>Open</Button>
          </div>
        )}
      </div>
      {isOpenEdit && (
        <AddExpense
          isEdit
          activeTab={"single"}
          handleSetActiveTab={() => setIsOpenEdit(false)}
          initalEditState={partialTransaction}
        />
      )}
    </div>
  );
};
