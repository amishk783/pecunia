import { Button } from "@/components/ui/button";
import { SummeryItem } from "@/components/ui/SummeryItem";
import { ChevronDown, ReceiptText, ScanLine, Table } from "lucide-react";
import { columns } from "./columns";

import { DataTable } from "@/components/table/data-table";
import { Transaction } from "@/type";
import { useEffect, useState } from "react";
import {
  copyTransaction,
  deleteTransaction,
  getAllTransaction,
} from "@/services/transaction";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { AddExpense } from "@/components/expense/add";

import { cn } from "@/lib/utils";

import { notification } from "@/components/Notification";
import { useExpense } from "@/lib/providers/ExpenseProvier";
import { PendingTransaction } from "@/components/expense/PendingTransaction";

const Expenses = () => {
  const { pendingTransaction, expenses, setExpenses } = useExpense();
 
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getAllTransaction();

        setExpenses(res);
      } catch (error) {
        throw new Error("Something Went wrong");
      }
    };
    fetchTransactions();
  }, [setExpenses]);

  const onActionDelete = async (id: number) => {
    try {
      const res = await deleteTransaction(id);
      const deletedTransaction: Transaction = res;

      setExpenses((prev) =>
        prev.filter((item) => item.id !== deletedTransaction.id)
      );
      notification({ type: "success", message: "Succefully Deleted" });
    } catch (error) {
      throw new Error("Something Went wrong");
    }
  };
  const onActionCopy = async (data: Transaction) => {
    try {
      if (!data.id) return;
      if (!data.notes) delete data.notes;

      const res = await copyTransaction(data, +data.id);
      const updatedTransaction: Transaction = res;

      setExpenses((prev) => [...prev, updatedTransaction]);
      notification({
        type: "success",
        message: `Succefully Copied ${data.label}`,
      });
    } catch (error) {
      throw new Error("Something Went wrong");
    }
  };

  const categories = Array.from(
    new Set(expenses.map((transaction) => transaction.category))
  ).map((category) => ({
    label: category,
    value: category,
  }));
  const totalExpenses = expenses.length;
  const totalAmountSpent = expenses.reduce((acc, expense) => {
    return acc + +expense.amount;
  }, 0);

  const [activeTab, setActiveTab] = useState<
    "single" | "scan" | "multiple" | null
  >(null);
  const handleSetActiveTab = (tab: "single" | "scan" | "multiple" | null) =>
    setActiveTab(tab);

  return (
    <div className={cn("flex w-full h-min  min-h-screen text-theme-themeText")}>
      <div className="flex flex-col justify-center items-center  w-full h-full gap-4  pt-2">
        <div className=" w-full h-min flex flex-col gap-4 justify-between items-center ">
          <div className="w-full h-min flex justify-between items-center border-b  px-2 md:px-4">
            <h2 className=" text-3xl font-medium">Expenses</h2>
            <div className=" py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center justify-center w-28 md:w-full  text-xs   rounded-3xl">
                    <p>New Expense</p>
                    <ChevronDown size={24} className="max-sm:w-2 max-sm:h-2" />
                  </Button>
                </DropdownMenuTrigger>
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuContent align="end" className="w-[200px] h-full">
                  <DropdownMenuLabel>
                    <p className="text-lg">Expense</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("single")}>
                    <div className="flex gap-2 text-md w-full h-10 items-center">
                      <ReceiptText size={24} className="" />
                      <h2 className="text-lg">Manually create</h2>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("scan")}>
                    <div className="flex gap-2 text-md w-full h-10 items-center">
                      <ScanLine size={24} className="" />
                      <h2 className="text-lg">Scan Transaction</h2>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("multiple")}>
                    <div className="flex gap-2 text-md w-full h-10 items-center">
                      <Table size={24} className="" />
                      <p className="text-lg">Create Multiple</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {activeTab && (
                <AddExpense
                  activeTab={activeTab}
                  handleSetActiveTab={handleSetActiveTab}
                />
              )}
            </div>
          </div>
          <div className=" w-full h-min px-2 text-theme-themeText">
            <div className="flex gap-2">
              <SummeryItem title="Total Transaction" amount={totalExpenses} />
              <SummeryItem title="Total Spent" amount={totalAmountSpent} />
            </div>
          </div>

          {pendingTransaction.length > 0 && (
            <div className="flex w-full items-start justify-start px-2">
              {pendingTransaction.map((transaction) => (
                <PendingTransaction {...transaction} />
              ))}
            </div>
          )}

          <div className="w-full mx-auto px-2 pb-10">
            <DataTable
              columns={columns}
              data={expenses}
              categories={categories}
              actions={{ onActionDelete, onActionCopy }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
