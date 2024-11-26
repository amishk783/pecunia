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
import { useAuth } from "@/lib/providers/AuthProvider";
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
import toast from "react-hot-toast";

const Expenses = () => {
  const [transactions, setTransaction] = useState<Transaction[]>([]);

  const { session } = useAuth();
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session) return;
      try {
        const res = await getAllTransaction();

        setTransaction(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactions();
  }, [session]);

  const onActionDelete = async (id: number) => {
    console.log(id);
    try {
      const res = await deleteTransaction(id);
      const deletedTransaction: Transaction = res;
      console.log(
        "🚀 ~ onActionDelete ~ deletedTransaction:",
        deletedTransaction
      );
      setTransaction((prev) =>
        prev.filter((item) => item.id !== deletedTransaction.id)
      );
      toast.success("Succefully Deleted");
    } catch (error) {
      console.log(error);
    }
  };
  const onActionCopy = async (data: Transaction) => {
    try {
      if (!data.id) return;
      if (!data.notes) delete data.notes;

      const res = await copyTransaction(data, +data.id);
      const updatedTransaction: Transaction = res;

      setTransaction((prev) => [...prev, updatedTransaction]);
      toast.success("Succefully Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  const categories = Array.from(
    new Set(transactions.map((transaction) => transaction.category))
  ).map((category) => ({
    label: category,
    value: category,
  }));
  const totalExpenses = transactions.length;
  const totalAmountSpent = transactions.reduce((acc, transactions) => {
    return acc + +transactions.amount;
  }, 0);

  const [activeTab, setActiveTab] = useState<
    "single" | "scan" | "multiple" | null
  >(null);
  const handleSetActiveTab = (tab: "single" | "scan" | "multiple" | null) =>
    setActiveTab(tab);

  // const { theme } = useTheme();
  return (
    <div className={cn("flex w-full h-min  min-h-screen")}>
      <div className="flex flex-col justify-center items-center  w-full h-full gap-4  pt-2">
        <div className=" w-full h-min flex flex-col gap-4 justify-between items-center ">
          <div className="w-full h-min flex justify-between items-center border-b  px-4">
            <h2 className=" text-3xl font-medium">Expenses</h2>
            <div className=" py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center justify-center rounded-3xl">
                    New Expense
                    <ChevronDown size={24} />
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
          <div className=" w-full h-min px-2">
            <div className="flex gap-2">
              <SummeryItem title="Total Transaction" amount={totalExpenses} />
              <SummeryItem title="Total Spent" amount={totalAmountSpent} />
            </div>
          </div>

          <div className="w-full mx-auto px-2">
            {
              <DataTable
                columns={columns}
                data={transactions}
                categories={categories}
                actions={{ onActionDelete, onActionCopy }}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
