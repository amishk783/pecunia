import { lifestyle, Bills, Debts } from "../constant";
import MultistepForm from "@/components/MultistepForm";

export const Lifestyle = () => {
  return (
    <div className="">
      <div className="container py-10">Get Started</div>
      <div className="container flex">
        <div className="">
          <MultistepForm
            items={lifestyle}
            category="lifestyle"
            nextRoute="/welcome/bills"
            
          />
        </div>
        <div>Hello</div>
      </div>
    </div>
  );
};

export const Bill = () => {
  return (
    <div className="">
      <div className="container py-10">Get Started</div>
      <div className="container flex">
        <div className="">
          <MultistepForm
            items={Bills}
            category="bills"
            nextRoute="/welcome/debt"
            prevRoute="/welcome/lifestyle"
          />
        </div>
        <div>Hello</div>
      </div>
    </div>
  );
};
export const Goal = () => {
  return (
    <div className="">
      <div className="container py-10">Get Started</div>
      <div className="container flex">
        <div className="">
          <MultistepForm
            items={Bills}
            category="goals"
            nextRoute="/welcome/debt"
            prevRoute="/welcome/lifestyle"
          />
        </div>
        <div>Hello</div>
      </div>
    </div>
  );
};

export const Debt = () => {
  return (
    <div className="">
      <div className="container py-10">Get Started</div>
      <div className="container flex">
        <div className="">
          <div>Do you currently have any debt ?</div>
          <MultistepForm
            items={Debts}
            category="debt"
            nextRoute="/welcome/goals"
            prevRoute="/welcome/bills"
          />
        </div>
        <div>Hello</div>
      </div>
    </div>
  );
};