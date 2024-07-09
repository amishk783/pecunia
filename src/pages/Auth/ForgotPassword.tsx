import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/providers/AuthProvider";

import { ArrowLeftIcon, Loader } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email({ message: "Please enter a valid email" }),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { resetPassword } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const email = getValues("email");

  const onSubmit = async (formDetails: FormData) => {
    event?.preventDefault();
    setLoading(true);

    try {
      await resetPassword(formDetails.email);
      setEmailSent(true);
    } catch (error) {
      setEmailSent(false);
      console.log(error);
    }
    setLoading(false);
  };

  const handleResend = () => {
    if (!email)
      toast("Email can't be empty", {
        className: "bg-red-400 text-white",
      });

    onSubmit({ email });
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
            <h2 className="text-3xl font-bold mb-4">Forgot your password?</h2>
            <p className="mb-4 text-gray-600">
              Don't worry, it happens! Let's get you a new one.
            </p>
            {emailSent && (
              <h2 className="flex text-blue-500 pb-4 gap-1.5 ">
                We sent a link to <p className="font-bold">{email}</p>
              </h2>
            )}

            <form
              className=" w-3/5 flex flex-col gap-2  rounded-lg "
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="name" className="mb-2 block leading-tight ">
                Enter your email
              </label>
              <Input
                name="email"
                type="email"
                label="Email"
                register={register}
                error={errors.email}
                placeholder="johndoe@gmail.com"
              />

              <Button
                className="my-2 flex items-center justify-center gap-3 "
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
              >
                Reset Password
                {loading ? <Loader className=" animate-spin" /> : ""}
              </Button>
            </form>

            <div className="w-3/5 flex justify-center items-center">
              <p>Didn't recieve the verification code? </p>
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={handleResend}
              >
                Resend
              </Button>
            </div>
            <div className="w-3/5 flex justify-center">
              <Button
                variant="ghost"
                className="px-2 flex items-center gap-1"
                onClick={() => navigate("/login")}
              >
                <ArrowLeftIcon className="text-blue-600 " />
                <p>Back to Login </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
