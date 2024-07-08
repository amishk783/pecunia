import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
const buttonVariants = cva("", {
  variants: {
    variant: {
      default: "bg-gray-200 text-black",
      primary: "bg-blue-500 text-white",
      destructive: "bg-red-500 text-white",
      outline: "border border-gray-500 text-gray-500 ",
      secondary: "bg-gray-500 text-white",
      ghost: "bg-transparent text-gray-500",
      link: "text-blue-500 underline",
    },

    size: {
      default: "px-4 py-2",
      sm: "px-2 py-1 rounded-md text-xs",
      lg: "px-8 py-3 rounded-md ",
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
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
