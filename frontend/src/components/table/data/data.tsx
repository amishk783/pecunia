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
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "This Week",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "This Month",
    value: "high",
    icon: ArrowUp,
  },

  {
    label: "Past Week",
    value: "high",
    icon: ArrowUp,
  },
  {
    label: "Past Month",
    value: "high",
    icon: ArrowUp,
  },
];
