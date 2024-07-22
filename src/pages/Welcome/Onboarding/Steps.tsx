import { useMultiForm } from "@/lib/providers/FormProvider";
import { Step } from "./Step";

type StepsType = {
  title: string;
};
const StepsItems: StepsType[] = [
  { title: "Welcome" },
  { title: "Bills" },
  { title: "Debt" },
  { title: "Subscriptions" },
  { title: "Goals" },
  { title: "Guilt Free" },
  { title: "Expenses sneak up to you" },
];

export const Steps = () => {
  const { currentStep } = useMultiForm();

  const getStatus = (index: number): "previous" | "current" | "next" => {
    let status: "previous" | "current" | "next";
    index += 1;
    if (index < currentStep) {
      status = "previous";
    } else if (index === currentStep) {
      status = "current";
    } else {
      status = "next";
    }
    return status;
  };

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        {StepsItems.map((step, index) => (
          <div key={index} className="flex gap-4 items-center">
            <Step status={getStatus(index)} title={step.title} />
          </div>
        ))}
      </div>
    </div>
  );
};
