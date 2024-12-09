import React from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  label: string;
  errorText?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<FieldValues & any>;
  required?: boolean;
  className?: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
  type?: "text" | "number" | "password" | "email";
  validate?: (value: string) => boolean | string;
}

export const Input: React.FC<Props> = ({
  name,

  required,
  register,
  className,
  placeholder,
  errorText,
  error,
  type = "text",
  validate,
}) => {
  return (
    <>
      <input
        className={cn(
          error ? "bg-red-50 border-red-200 border-2" : "bg-zinc-200",
          "w-full h-1 py-6 px-4 focus:outline-none focus:border-0 focus:bg-blue-100 shadow-sm rounded-md ",
          className
        )}
        placeholder={placeholder}
        {...{ type }}
        {...register(name, {
          required,
          validate,
        })}
      />
      {errorText && error && (
        <div className=" text-sm mt-2 ml-2 text-red-400">
          {!error?.message && error?.type === "required"
            ? "This field is required"
            : error?.message}
        </div>
      )}
    </>
  );
};
