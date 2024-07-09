import React, { useRef } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { config } from "@/config";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabaseClient";

import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/providers/AuthProvider";
import { Loader } from "lucide-react";
import PasswordStrengthChecker from "@/components/ui/PasswordStrengthChecker";

const schema = z
  .object({
    password: z
      .string()
      .min(1, "Password cannot be empty")
      .min(6, { message: "Should be greater than 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, "Password cannot be empty")
      .min(6, { message: "Should be greater than 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords didn't match. Try again",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const UpdatePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { updatePassword } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const watchPassword = watch("password") || '';
  console.log(watchPassword);

  const onSubmit = async (formDetails: FormData) => {
    event?.preventDefault();
    setLoading(true);

    try {
      await updatePassword(formDetails.password);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-white ">
      <div className=" gap-20 m-auto rounded-lg shadow-lg  h-screen flex">
        {/* left part */}
        <div className=" w-2/5 p-8 bg-red-50">
          <h1 className="text-2xl font-bold mb-4">FINOTIC</h1>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-500">CURRENT BALANCE</p>
            <p className="text-3xl font-bold">${24359}</p>
          </div>
          <div className="relative h-40 w-40 mx-auto mb-4">
            {/* Placeholder for pie chart */}
            <div className="absolute inset-0 rounded-full bg-blue-500"></div>
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <span className="text-xl font-bold">34</span>
            </div>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
            New transaction
          </button>
        </div>
        {/* right part */}
        <div className=" w-3/5 flex justify-center items-center  bg-white ">
          <div className="w-4/5 ml-auto">
            <h2 className="text-3xl font-bold mb-4">Set your new password</h2>
            <p className="mb-6 text-gray-600">Make it a strong one!</p>

            <form
              className=" w-3/5 flex flex-col gap-2  rounded-lg "
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="name" className="mb-2 block leading-tight ">
                Password
              </label>
              <Input
                name="password"
                type="password"
                label="password"
                register={register}
                error={errors.password}
                placeholder=""
              />
              {<PasswordStrengthChecker password={watchPassword} />}
              <label htmlFor="name" className="mb-2 block leading-tight ">
                Confirm Password
              </label>
              <Input
                name="confirmPassword"
                type="password"
                label="password"
                register={register}
                error={errors.confirmPassword}
                placeholder=""
              />

              <Button
                className="my-2 flex items-center justify-center gap-3 "
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
              >
                Update Password
                {loading ? <Loader className=" animate-spin" /> : ""}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
