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
    pathUrl: "/dashboard",
  },
  {
    icon: CircleGauge,
    text: "Analytics",
    pathUrl: "/analytics",
  },
  {
    icon: User,
    text: "Users",
    pathUrl: "/users",
  },
  {
    icon: PanelsTopLeft,
    text: "Account",
    pathUrl: "/account",
  },
  {
    icon: ShoppingCart,
    text: "Projects",
    pathUrl: "/projects",
  },
];
