import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
  console.log("🚀 ~ UpdatePassword ~ navigate:", navigate);
  const [loading, setLoading] = useState(false);
  const watchPassword = watch("password") || "";
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
    <div className="h-screen">
      <div className="h-full rounded-lg shadow-lg flex flex-col md:flex-row lg:justify-center md:gap-5">
        {/* left part */}
        <h1 className="absolute lg:hidden text-start z-30 text-3xl px-6 py-8 font-bold">
          Pecunia
        </h1>
        <div className="hidden lg:flex w-full md:w-1/2 xl:w-2/5  bg-red-50  lg:bg-[#ffe8c8]">
          <h1 className="absolute z-30 text-2xl p-10 font-bold">Pecunia</h1>
          <div className="relative flex flex-col items-center justify-center w-full  pt-10">
            <div className="hidden md:flex items-center justify-center">
              <img
                className=" rounded-lg z-10 mt-10 "
                src="/updatePassword.jpg"
              />
            </div>
          </div>
        </div>
        {/* right part */}
        <div className=" h-full w-full md:w-xl:w-3/5 flex justify-center items-center bg-red-50 md:pt-10  lg:bg-white ">
          <div className="w-[90%] xl:w-4/5 xl:ml-auto">
            <div className="flex items-center lg:hidden justify-center mb-6">
              <img
                className="rounded-full z-10 mt-10  w-44"
                src="/updatePassword.jpg"
              />
            </div>
            <h2 className="text-3xl font-bold mb-4">Set your new password</h2>
            <p className="mb-6 text-gray-600">Make it a strong one!</p>

            <form
              className="w-full  flex flex-col gap-2  rounded-lg xl:w-3/5"
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
