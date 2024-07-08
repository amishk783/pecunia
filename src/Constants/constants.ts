import { LucideIcon } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { CircleGauge, User, PanelsTopLeft, ShoppingCart } from "lucide-react";
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
    icon: User,
    text: "Insights",
    pathUrl: "app/users",
  },
  {
    icon: PanelsTopLeft,
    text: "Budget",
    pathUrl: "app/budget",
  },
  {
    icon: ShoppingCart,
    text: "Projects",
    pathUrl: "app/projects",
  },
];
