import React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "",
      primary: "",
      destructive: "",
      outline: "",
      secondary: "",
      ghost: "",
      link: "",
    },
    size: {
      default: "px-4 py-2",
      sm: "px-3 rounded-md text-xs",
      lg: "px-8 rounded-md ",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  children,
}) => {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))}>
      {children}
    </button>
  );
};

export default Button;
