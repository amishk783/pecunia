import { useMultiForm } from "@/lib/providers/FormProvider";
import {
  lifestyle,
  Bills,
  Debts,
  Subscriptions,
  GuiltFreeExpenses,
  HiddenExpenses,
  Goals,
} from "../constant";

import PageStep from "./PageStep";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

export const Lifestyle = () => {
  return (
    <PageStep
      items={lifestyle}
      category="Lifestyle"
      nextRoute="/welcome/bills/"
      stepNumber={1}
      question="Tell us more about your daily lifestyle?"
    />
  );
};

export const Bill = () => {
  return (
    <PageStep
      items={Bills}
      category="Bills"
      nextRoute="/welcome/debt"
      prevRoute="/welcome/lifestyle"
      stepNumber={2}
      question="What are your recurring monthly bills?"
    />
  );
};

export const Debt = () => {
  return (
    <PageStep
      items={Debts}
      category="Debt"
      nextRoute="/welcome/subscription"
      prevRoute="/welcome/bills"
      stepNumber={3}
      question="Do you have any outstanding debts?"
    />
  );
};

export const Subscription = () => {
  return (
    <PageStep
      items={Subscriptions}
      category="Subscription"
      nextRoute="/welcome/goals"
      prevRoute="/welcome/debt"
      stepNumber={4}
      question="What subscriptions do you currently have?"
    />
  );
};

export const Goal = () => {
  return (
    <PageStep
      items={Goals}
      category="Goals"
      nextRoute="/welcome/guilt-free"
      prevRoute="/welcome/debt"
      stepNumber={5}
      question="What are your financial goals?"
    />
  );
};

export const GuiltFreeExpense = () => {
  return (
    <PageStep
      items={GuiltFreeExpenses}
      category="Guilt Free"
      nextRoute="/welcome/hidden-expense"
      prevRoute="/welcome/goals"
      stepNumber={6}
      question="What are your guilt-free spending categories?"
    />
  );
};

export const HiddenExpense = () => {
  return (
    <PageStep
      items={HiddenExpenses}
      category="Extra"
      nextRoute="/welcome/submit/"
      prevRoute="/welcome/guilt-free"
      stepNumber={7}
      question="Are there any hidden expenses you need to account for?"
    />
  );
};

export const OnboardingComplete = () => {
  const { formValue } = useMultiForm();
  console.log("🚀 ~ OnboardingComplete ~ formValue:", formValue);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const postOboardingData = async () => {
      const currentDate = new Date();
      try {
        setIsLoading(true);
        const date = format(currentDate, "dd/MM/yyyy");
        const response = await api.post("/app/budget/onboarding-complete", {
          date,
        });
        console.log("🚀 ~ postOboardingData ~ response:", response);

        navigate("/");
        setIsLoading(false);
      } catch (error) {
        console.error("Error posting data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    postOboardingData();
  }, [navigate]);

  return (
    isLoading && (
      <div className="w-full h-screen flex items-center justify-center align-middle top-1/2">
        <Loader className=" flex justify-center items-center w-12 h-12 animate-spin" />
      </div>
    )
  );
};
