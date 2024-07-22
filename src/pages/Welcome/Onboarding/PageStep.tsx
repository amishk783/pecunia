import React, { useEffect } from "react";
import MultistepForm from "@/components/MultistepForm";
import { Steps } from "./Steps";
import { useMultiForm } from "@/lib/providers/FormProvider";
import { ItemsType } from "../constant";
import { motion } from "framer-motion";
import { useState } from "react";
interface PageStepProps {
  items: ItemsType[];
  category: string;
  nextRoute: string;
  prevRoute?: string;
  stepNumber: number;
  question?: string;
}

const PageStep: React.FC<PageStepProps> = ({
  items,
  category,
  nextRoute,
  prevRoute,
  stepNumber,
  question,
}) => {
  const { setCurrentStep } = useMultiForm();

  useEffect(() => {
    setCurrentStep(stepNumber);
  }, [stepNumber, setCurrentStep]);

  return (
    <div className="">
      <div className="bg-white drop-shadow">
        <div className="container py-5 md:py-10 ">
          <h2 className="text-2xl md:text-3xl font-medium">Get Started</h2>
        </div>
        <motion.div
          initial={{ scaleX: (stepNumber - 1) / 7 }}
          animate={{ scaleX: stepNumber / 7 }}
          transition={{
            ease: "easeIn",
            type: "tween",
            stiffness: 260,
            damping: 20,
          }}
          className=" bg-indigo-300 opacity-100  z-50 w-full fixed animate-glowing  h-2 origin-[0%] duration-300 ease-out rounded-[30px]"
        ></motion.div>
      </div>
      <div className="container flex pt-10 gap-10">
        <div className="w-full lg:w-2/3 xl:w-1/2 pt-5">
          {question && (
            <div className="text-lg md:text-3xl font-bold md:mb-5">
              {question}
            </div>
          )}
          <MultistepForm
            items={items}
            category={category}
            nextRoute={nextRoute}
            prevRoute={prevRoute}
          />
        </div>
        <div className="pl-10 lg:w-1/3 xl:w-1/2  xl:pl-28 hidden lg:block">
          <Steps />
        </div>
      </div>
    </div>
  );
};

export default PageStep;
