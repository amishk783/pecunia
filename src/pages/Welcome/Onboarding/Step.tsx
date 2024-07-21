import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
interface StepProps {
  status: "previous" | "current" | "next";
  title: string;
}

export const Step: React.FC<StepProps> = ({ status, title }) => {
  return (
    <div className="flex gap-4 items-center w-2/3 whitespace-nowrap  ">
      <div
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full relative",
          status === "previous"
            ? "bg-green-300"
            : status === "current"
            ? "ring-4"
            : "bg-zinc-200 ring-slate-400 ring-2 p-5"
        )}
      >
        <Check
          size={36}
          className={cn(
            " w-28 p-1 text-white",
            status === "next" ? "hidden" : "visible"
          )}
        />
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, ease: easeInOut }}
          exit={{ opacity: 0 }}
          className={cn(
            "w-1 h-14 py-4 bg-orange-300 absolute border-2 mt-24 ",
            status === "previous" ? "border-green-300" : "hidden"
          )}
        ></motion.div> */}
        <div
          className={cn(
            "xl:mx-20 mt-10  absolute -z-10   ",
            status === "previous" ? "border-green-300" : "hidden"
          )}
        >
          <motion.svg width="50" height="110" className="gap-2 stroke-green-500">
            <defs>
              <linearGradient
                id="customGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#97203E" />
                <stop offset="100%" stopColor="#FF3800" />
              </linearGradient>
            </defs>
            {/* <motion.path
              initial={{ pathLength: 0, pathSpacing: 0.4 }}
              whileInView={{ pathLength: 1, pathSpacing: 0.4 }}
              transition={{
                pathLength: {
                  delay: 0.4,
                  type: "tween",
                  duration: 10,
                  ease: "linear",
                  // repeat: Infinity,
                  bounce: 0,
                },
              }}
              className=""
              strokeDasharray="3.846, 2.282"
              strokeDashoffset="0"
              strokeWidth="3.641"
              id="svgPath"
              stroke="url(#customGradient)"
              fill="none"
              d="M 25 45 L 250 154000"
              transform=" "
            ></motion.path> */}
            <path
              id=""
              className=""
              stroke=""
              strokeDasharray="3.846, 2.282"
              strokeDashoffset="0"
              strokeWidth="1.641"
              fill="none"
              d="M 25 45 L 250 154000"
              transform=""
            ></path>
          </motion.svg>
        </div>
      </div>
      <div className="w-2/3  border-b-2 justify-items-start min-h-min min-w-80 py-6 ">
        <h2 className=" text-2xl font-medium">{title}</h2>
      </div>
    </div>
  );
};
