import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/lib/providers/AuthProvider";

import { ArrowLeftIcon, Loader } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
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
    <div className="h-screen">
      <div className="h-full rounded-lg shadow-lg flex flex-col md:flex-row md:justify-center md:gap-5">
        {/* left part */}
        <h1 className="absolute lg:hidden z-30 text-3xl px-6 py-8 font-bold">
          Pecunia
        </h1>
        <div className="hidden lg:flex w-full md:w-1/2 xl:w-2/5  bg-red-50  md:bg-[#ffe8c8]">
          <h1 className="absolute z-30 text-2xl p-10 font-bold lg:text-4xl">
            Pecunia
          </h1>
          <div className="relative flex flex-col items-center justify-center w-full  pt-10">
            <div className="hidden md:flex items-center justify-center">
              <img
                width={440}
                className=" rounded-lg z-10 mt-10 "
                src="/resetPassword.jpg"
              />
            </div>
          </div>
        </div>
        {/* right part */}
        <div className="h-full w-full md:w-xl:w-3/5 flex justify-center items-center bg-red-50 md:pt-10  lg:bg-white">
          <div className="w-[90%] xl:w-4/5 xl:ml-auto">
            <div className="flex items-center sm:hidden justify-center mb-6">
              <img
                className="rounded-full z-10 mt-10  w-44"
                src="/resetPassword.jpg"
              />
            </div>
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
              className="w-full  flex flex-col gap-2  rounded-lg xl:w-3/5"
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
                size="lg"
                type="submit"
                disabled={loading}
              >
                Reset Password
                {loading ? <Loader className=" animate-spin" /> : ""}
              </Button>
            </form>

            <div className="xl:w-3/5 flex justify-center items-center">
              <p>Didn't recieve the verification code? </p>
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={handleResend}
              >
                Resend
              </Button>
            </div>
            <div className="xl:w-3/5 flex justify-center">
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
