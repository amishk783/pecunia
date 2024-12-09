import { checkScanStatus, uploadReceipt } from "@/services/transaction";
import { PendingTransactionType, Transaction } from "@/type";
import { createContext, useContext, useState } from "react";

interface ExpenseContextType {
  pendingTransaction: PendingTransactionType[];
  expenses: Transaction[];
  handleReceiptUpload: (file: File) => void;
  pollScanStatus: (sessionId: string) => void;
  scanStatus: "IDLE" | "PROCESSING" | "COMPLETED" | "FAILED";
  setPendingTransaction: React.Dispatch<
    React.SetStateAction<PendingTransactionType[]>
  >;
  setExpenses: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const ExpensesContext = createContext<ExpenseContextType | null>(null);

export const ExpenseProvier = ({ children }: { children: React.ReactNode }) => {
  const [pendingTransaction, setPendingTransaction] = useState<
    PendingTransactionType[]
  >([]);
  const [scanStatus, setScanStatus] = useState<
    "IDLE" | "PROCESSING" | "COMPLETED" | "FAILED"
  >("IDLE");
  const [scanSessionId, setScanSessionId] = useState<string | null>(null);
  console.log("🚀 ~ ExpenseProvier ~ scanSessionId:", scanSessionId);
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  const handleReceiptUpload = async (file: File) => {
    console.log("🚀 ~ handleReceiptUpload ~ file:", file);
    try {
      const res = await uploadReceipt(file);
      console.log("🚀 ~ handleReceiptUpload ~ res:", res);

      setScanSessionId(res.scanSessionId);
      setScanStatus("PROCESSING");

      const expense: PendingTransactionType = {
        sessionId: res.scanSessionId,
        label: "",
        billImageUrl: file,
        status: "PROCESSING",
      };
      setPendingTransaction((prev) => [...prev, expense]);

      pollScanStatus(res.scanSessionId);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTransactionStatus = (
    sessionId: string,
    status: PendingTransactionType["status"]
  ) => {
    setPendingTransaction((prev) =>
      prev.map((transaction) =>
        transaction.sessionId === sessionId
          ? { ...transaction, status }
          : transaction
      )
    );
  };

  const removePendingTransaction = (sessionId: string) => {
    setPendingTransaction((prev) =>
      prev.filter((transaction) => transaction.sessionId !== sessionId)
    );
  };
  console.log(
    "🚀 ~ removePendingTransaction ~ removePendingTransaction:",
    removePendingTransaction
  );

  // this implmentation doesn't track state of every receipt

  const pollScanStatus = async (sessionId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const status = await checkScanStatus(sessionId);
        if (status.status === "COMPLETED") {
          clearInterval(intervalId);

          updateTransactionStatus(sessionId, "COMPLETED");
          // removePendingTransaction(sessionId);
          setScanStatus("COMPLETED");
        }
        if (status.status === "FAILED") {
          clearInterval(intervalId);
          updateTransactionStatus(sessionId, "FAILED");
          // removePendingTransaction(sessionId);
          setScanStatus("FAILED");
        }
      } catch (error) {
        console.log(error);
      }
    }, 6000);
  };
  return (
    <ExpensesContext.Provider
      value={{
        pendingTransaction,
        expenses,
        scanStatus,
        handleReceiptUpload,
        pollScanStatus,
        setPendingTransaction,
        setExpenses,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpense must be used within a BudgetProvider");
  }
  return context;
};
