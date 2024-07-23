import { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { CircleGauge, } from "lucide-react";
import { Bitcoin } from "lucide-react";
import { SquareGanttChart , CandlestickChartIcon } from "lucide-react";
export interface DashboardType {
  icon: LucideIcon;
  text: string;
  pathUrl: string;
}

export const adminDashboard: DashboardType[] = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    pathUrl: "app/dashboard",
  },
  {
    icon: CircleGauge,
    text: "Goals",
    pathUrl: "app/analytics",
  },
  {
    icon: CandlestickChartIcon,
    text: "Insights",
    pathUrl: "app/users",
  },
  {
    icon: Bitcoin,
    text: "Budget",
    pathUrl: "app/budget",
  },
  {
    icon: SquareGanttChart,
    text: "Roadmap",
    pathUrl: "app/projects",
  },
];
