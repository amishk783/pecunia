import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react";
export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];

export const dates = [
  {
    label: "All",
    value: "all",
    icon: ArrowDown,
  },
  {
    label: "This Week",
    value: "thisWeek",
    icon: ArrowRight,
  },
  {
    label: "This Month",
    value: "thisMmonth",
    icon: ArrowUp,
  },

  {
    label: "Past Week",
    value: "pastWeek",
    icon: ArrowUp,
  },
  {
    label: "Past Month",
    value: "pastMonth",
    icon: ArrowUp,
  },
];
