import { MultipleLineChart } from "@/components/charts/MultipleLineChart";
import { RadialChart } from "@/components/charts/ReadialChart";
import { DataTable } from "@/components/table/data-table";
import { SummeryItem } from "@/components/ui/SummeryItem";
import Weather from "@/components/widgets/weather/wheather";
import { useAuth } from "@/lib/providers/AuthProvider";
import { cn, getTimeOfDay } from "@/lib/utils";
import { Transaction } from "@/type";

import { columns } from "./columns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { RadarChart } from "@/components/charts/RadarChart";

const recentTransacaction: Transaction[] = [
  {
    id: "26",
    label: "daily commute",
    amount: "500",
    paidVia: "Cash",
    notes: undefined,
    date: "Nov 22, 2024",
    category: "Swiggy",
  },
  {
    id: "28",
    label: "daily commute",
    amount: "500",
    paidVia: "Cash",
    notes: undefined,
    date: "Nov 22, 2024",
    category: "Swiggy",
  },
  {
    id: "29",
    label: "daily commute",
    amount: "500",
    paidVia: "Cash",
    notes: undefined,
    date: "Nov 26, 2024",
    category: "Amazon",
  },
  {
    id: "30",
    label: "daily commute",
    amount: "20000",
    paidVia: "Cash",
    notes: undefined,
    date: "Nov 26, 2024",
    category: "Amazon",
  },

  {
    id: "32",
    label: "daily commute",
    amount: "20000",
    paidVia: "Cash",
    notes: undefined,
    date: "Nov 26, 2024",
    category: "Amazon",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user);

  const timeOfDay = getTimeOfDay(new Date());

  return (
    <div className={cn("p-5 w-full min-h-screen text-theme-themeText")}>
      <div className="flex py-2  ">
        <h2 className=" font-medium text-3xl ">Good {timeOfDay}, Sujit</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex w-full gap-4 ">
          <SummeryItem
            className="text-sm "
            title="Total Spent"
            amount={32499}
          />

          <SummeryItem
            className="text-sm "
            title="Total Balance"
            amount={32499}
          />
          <SummeryItem
            className="text-sm "
            title="Total Savings"
            amount={32499}
          />
          <Weather />
        </div>

        <div className="w-full gap-4  flex">
          <MultipleLineChart className={cn(" bg-theme-primary")} />
          <div
            className={cn(
              "flex flex-col space-y-4 p-6 bg-theme-primary rounded-lg"
            )}
          >
            <div className="flex justify-between  items-center">
              <h2 className=" text-xl font-semibold">Expense Breakdown</h2>
              <div>Today</div>
            </div>
            <RadialChart />
          </div>
          <div
            className={cn(
              "flex flex-col space-y-4 p-6 bg-theme-primary rounded-lg"
            )}
          >
            <div className="flex justify-between items-center">
              <h2 className=" text-xl font-semibold">Montly Breakdown</h2>
              <div>Today</div>
            </div>
            <RadarChart />
          </div>
        </div>

        <div className="flex gap-2 w-full h-full">
          <div
            className={cn(
              "w-1/2 flex flex-col gap-4 h-full bg-theme-primary px-4 py-3 rounded-lg"
            )}
          >
            <div className="py-2">
              <h2 className=" text-2xl ">Recent Transactions</h2>
            </div>
            <DataTable
              pagination={false}
              data={recentTransacaction}
              columns={columns}
            />
          </div>
          <div
            className={cn(
              "w-1/3 h-full bg-theme-primary justify-center flex p-0 rounded-lg"
            )}
          >
            <Calendar className=" " />
          </div>
          <div className={cn("w-1/3  flex rounded-lg bg-theme-primary")}>
            <div className="p-6 flex flex-col justify-between w-full  h-full ">
              <div className="flex flex-col space-y-14">
                <div className=" flex justify-between items-center">
                  <h5 className="text-xl font-semibold">Pro Version</h5>
                  <p> Details</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <h5 className="text-2xl font-bold">More with Premium</h5>
                  <p>
                    Our premium subscription elevate your experience and unlock
                    more benefits
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 ">
                <div className="flex flex-col">
                  <p>Your Pay</p>
                  <h4 className="flex text-3xl items-center gap-1">
                    $19,99<span className="text-sm">/Month</span>
                  </h4>
                </div>
                <Button className=" bg-theme-secondary">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
