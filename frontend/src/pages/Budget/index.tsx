import { BudgetGroup } from "@/components/Expense/BudgetGroup";
import { BudgetItemProps } from "@/components/Expense/BudgetItem";
const initalItems: BudgetItemProps[] = [
  {
    id: 1,
    label: "hello",
    planned: "500",
    received: "500",
  },
  {
    id: 2,
    label: "bye",
    planned: "500",
    received: "500",
  },
  { id: 3, label: "shy", planned: "500", received: "500" },
];
const Budget = () => {
  return (
    <div className="w-full m-4">
      <div className="flex flex-col justify-center items-center">
        Budget
        <div className="w-2/3">
          <BudgetGroup initalItems={initalItems} />
        </div>
      </div>
    </div>
  );
};

export default Budget;
