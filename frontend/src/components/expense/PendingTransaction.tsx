import { PendingTransactionType } from "@/type";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export const PendingTransaction: React.FC<PendingTransactionType> = ({
  sessionId,
  label,
  billImageUrl,
  status,
}) => {
  console.log("🚀 ~ label:", label);
  console.log("🚀 ~ sessionId:", sessionId);
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
            <Button>Open</Button>
          </div>
        )}
      </div>
    </div>
  );
};
