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

export const Lifestyle = () => {
  return (
    <PageStep
      items={lifestyle}
      category="Lifestyle"
      nextRoute="/welcome/bills/"
      stepNumber={1}
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
    />
  );
};
export const HiddenExpense = () => {
  return (
    <PageStep
      items={HiddenExpenses}
      category="Extra"
      nextRoute="/welcome/"
      prevRoute="/welcome/guilt-free"
      stepNumber={7}
    />
  );
};
