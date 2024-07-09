import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { Provider } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/providers/AuthProvider";

import { Input } from "@/components/ui/Input";
import PasswordStrengthChecker from "@/components/ui/PasswordStrengthChecker";
import Button from "@/components/ui/Button";

import { Github, Loader, Eye } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .min(6, { message: "Should be greater than 6 characters" }),
});

type FormData = z.infer<typeof schema>;

type activeLoginButton = "password" | "github" | "google" | "default";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { signUp } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<activeLoginButton>("password");

  const [viewPassword, setViewPassword] = useState<boolean>(false); // hanndling view of the password
  const watchPassword = watch("password") || "";
  const onSubmit = async (formDetails: FormData) => {
    event?.preventDefault();
    const { email, password } = formDetails;
    setLoading(true);
    setActive("password");
    try {
      await signUp(email, password);
      toast("Welcome Aboard!", {
        className: " text-green-300",
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const signItWithOAuth = async (selectedProvider: string) => {
    console.log(selectedProvider);
    setLoading(true);
    setActive("github");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: selectedProvider as Provider,
      });
      console.log(data.provider);
      console.log(data.url);
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setActive("default");
  };

  const handleViewPassword = () => {
    event?.preventDefault();
    setViewPassword((prevState) => !prevState);
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
            <h2 className="text-3xl font-bold mb-4">Join Us Today!</h2>
            <p className="mb-6 text-gray-600">
              Take control of your finances with ease and efficiency.
            </p>

            <form
              className=" w-3/5 flex flex-col gap-2  rounded-lg "
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="name" className="mb-2 block leading-tight ">
                Email
              </label>
              <Input
                name="email"
                type="email"
                label="Email"
                register={register}
                error={errors.email}
                placeholder="johndoe@gmail.com"
              />
              <label htmlFor="name" className="my-2 block leading-tight ">
                Password
              </label>
              <div className="relative flex items-center justify-end">
                <Input
                  name="password"
                  type={viewPassword ? "text" : "password"}
                  label="Password"
                  register={register}
                  error={errors.password}
                  placeholder="At least 8 characters"
                />
                <Button
                  variant="ghost"
                  className={cn(
                    "absolute mr-4 focus:outline-none",
                    viewPassword ? "text-blue-500" : ""
                  )}
                  onClick={handleViewPassword}
                >
                  <Eye />
                </Button>
              </div>
              <PasswordStrengthChecker password={watchPassword} />
              <Button
                className="my-2 flex items-center justify-center gap-3 "
                variant="primary"
                size="lg"
                type="submit"
                disabled={loading}
              >
                Sign Up
                {loading && active === "password" ? (
                  <Loader className=" animate-spin" />
                ) : (
                  ""
                )}
              </Button>
            </form>
            {/* serperation */}
            <div className="w-3/5 py-4 flex gap-4 justify-center">
              <div className="border-b-2 border-zinc-300 w-1/3  mb-3"></div>
              <p className="text-2xl">or</p>
              <div className="border-b-2 border-zinc-300 w-1/3  mb-3"></div>
            </div>

            {/* auth providers options */}

            <div className="w-3/5 py-4 flex gap-4 ">
              <div className="flex gap-4 w-full">
                <Button
                  className="flex gap-2 items-center w-full justify-center"
                  variant="outline"
                  size="lg"
                  onClick={() => signItWithOAuth("google")}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="10"
                    height="10"
                    viewBox="0 0 48 48"
                    className="w-5 h-5 p-0 m-0"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <p>Google</p>
                  {loading && active === "google" ? (
                    <Loader className=" animate-spin" />
                  ) : (
                    ""
                  )}
                </Button>
                <Button
                  className="flex gap-2 items-center w-full justify-center"
                  variant="outline"
                  size="lg"
                  disabled={loading}
                  onClick={() => signItWithOAuth("github")}
                >
                  <Github /> <p>Github</p>
                  {loading && active === "github" ? (
                    <Loader className=" animate-spin" />
                  ) : (
                    ""
                  )}
                </Button>
              </div>
            </div>
            <div className="w-3/5 flex justify-center items-center">
              <p>Have an account?</p>
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={() => navigate("/login")}
              >
                Log in.
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
