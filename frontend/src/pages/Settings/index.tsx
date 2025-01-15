import { cn } from "@/lib/utils";
import { useState } from "react";
import { GernalSection } from "./gernal";
import { BankSection } from "./banks";

const Settings = () => {
  const transactionWidth = (20 / 100) * 100;
  console.log("🚀 ~ Settings ~ transactionWidth:", transactionWidth);

  const [activeTab, setActiveTab] = useState<"Gernal" | "Preference" | "Banks">(
    "Gernal"
  );

  return (
    <main className=" py-8 px-6 w-full min-h-screen  text-secondary-foreground  ">
      <div className="w-full space-y-6 flex-col h-full">
        <h2 className="text-3xl font-medium">Settings</h2>

        <div className="flex justify-between  bg-background text-secondary-foreground  py-1 px-2 rounded-3xl w-max items-center gap-4 text-xl">
          <div
            onClick={() => setActiveTab("Gernal")}
            className={cn(
              " px-8 py-1 rounded-3xl",
              activeTab === "Gernal"
                ? "  bg-primary text-primary-foreground  drop-shadow-2xl shadow-md shadow-slate-950/40  "
                : ""
            )}
          >
            Gernal
          </div>
          <div
            onClick={() => setActiveTab("Preference")}
            className={cn(
              " px-8 py-1 rounded-3xl",
              activeTab === "Preference"
                ? "  bg-primary text-primary-foreground "
                : " "
            )}
          >
            Preference
          </div>
          <div
            onClick={() => setActiveTab("Banks")}
            className={cn(
              " px-8 py-1 rounded-3xl",
              activeTab === "Banks" ? " bg-black text-white  " : ""
            )}
          >
            Banks
          </div>
        </div>
        {activeTab === "Gernal" && <GernalSection />}
        {activeTab === "Banks" && <BankSection />}
      </div>
    </main>
  );
};
export default Settings;
