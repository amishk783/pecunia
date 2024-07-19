import {
  useContext,
  createContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface FormValueType {
  formValue: Record<string, string[]>;
  updateFormValue: (category: string, selections: string[]) => void;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}
const FormContext = createContext<FormValueType | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formValue, setFormValue] = useState<Record<string, string[]>>({});
  const [currentStep, setCurrentStep] = useState(1);
 console.log(formValue)
  const updateFormValue = (category: string, selections: string[]) => {
    setFormValue((prev) => ({ ...prev, [category]: selections }));
  };
  return (
    <FormContext.Provider
      value={{ formValue, updateFormValue, setCurrentStep, currentStep }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useMultiForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("context must be used within the context provider");
  }
  return context;
};
