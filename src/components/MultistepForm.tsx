import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useMultiForm } from "@/lib/providers/FormProvider";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";
import Button from "./ui/Button";
import { cn } from "@/lib/utils";

export interface Item {
  value: string;
  logo: string;
  label: string;
}

interface MultistepFormProps {
  items: Item[];
  category: string;
  nextRoute: string;
  prevRoute?: string;
}

const MultistepForm: React.FC<MultistepFormProps> = ({
  items,
  category,
  nextRoute,
  prevRoute,
}) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const { currentStep, setCurrentStep, updateFormValue } = useMultiForm();
  console.log(selected);

  const toggleCheck = (value: string) => {
    setSelected((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
    updateFormValue(category, selected);
  };

  const handleNext = () => {
    if (selected.length < 0) {
      toast.error("Please select at least one option");
    }
    setCurrentStep((prev) => prev + 1);
    navigate(nextRoute);
  };
  const handlePrev = () => {
    if (prevRoute) {
      navigate(prevRoute);
      setCurrentStep((prev) => prev - 1);
    }
  };
  return (
    <div className="">
      <div className="w-full grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.value}
            onClick={() => toggleCheck(item.value)}
            className="w-full flex items-center justify-center h-32 drop-shadow-lg shadow-md rounded-lg cursor-pointer"
          >
            <label
              htmlFor={item.value}
              className="flex items-center justify-start flex-col gap-3 p-2"
            >
              {selected.includes(item.value) ? (
                <BadgeCheck size={64} color="green" className=" " />
              ) : (
                <img src={item.logo} width={64} />
              )}
              {item.label}
            </label>
            <input
              type="checkbox"
              value="rent"
              name="lifestyle"
              className=" absolute top-[-9999px] left-[-9999px]"
            />
          </div>
        ))}
      </div>
      <div
        className={cn(
          "flex mt-8",
          currentStep > 1 ? "justify-between" : "justify-end"
        )}
      >
        {currentStep > 1 && (
          <Button variant="ghost" onClick={handlePrev}>
            Go Back
          </Button>
        )}
        <Button variant="primary" className="rounded-md" onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MultistepForm;
