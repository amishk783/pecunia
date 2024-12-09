import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Provider } from "@supabase/supabase-js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { cn } from "@/lib/utils";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/lib/providers/AuthProvider";
import { financialAdvice } from "./constant";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Github, Loader, Eye, Plus } from "lucide-react";
import PasswordStrengthChecker from "@/components/ui/PasswordStrengthChecker";

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

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { logIn } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<activeLoginButton>("password");

  const [viewPassword, setViewPassword] = useState<boolean>(false); // hanndling view of the password
  const watchPassword = watch("password") || "";

  const onSubmit = async (formDetails: FormData) => {
    const { email, password } = formDetails;
    try {
      setLoading(true);
      setActive("password");
      await logIn(email, password);
      toast("Welcome Aboard!", {
        className: " text-green-300",
      });
      navigate("/app/dashboard");
    } catch (error) {
      // toast.error(error);
    }
    setLoading(false);
  };

  const signItWithOAuth = async (selectedProvider: string) => {
    setLoading(true);
    setActive("github");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: selectedProvider as Provider,
      });
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
    <div className="h-screen">
      <div className="h-full rounded-lg shadow-lg flex flex-col md:flex-row ">
        {/* left part */}
        <div className="w-full md:w-1/2 xl:w-2/5 flex px-4 md:justify-center bg-red-50">
          <div className="flex flex-col items-center justify-center w-full  pt-10">
            <h1 className="text-2xl font-bold md:mb-10">Pecunia</h1>

            {/* grid image part */}
            <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-6 grid-rows-4 gap-8 self-center pt-10 ">
              <img
                className="w-48 xl:w-60 rounded-lg col-start-1 col-span-3 xl:col-start-2 xl:col-span-4 row-start-1 row-span-2 drop-shadow-lg "
                width={240}
                src="/loginCover.jpg"
              />
              <img
                className="w-48 xl:w-60 rounded-lg col-start-2 col-span-3 xl:col-start-4 xl:col-span-6 row-start-2 row-span-3 ml-10 z-10  aspect-[8/7] drop-shadow-lg "
                src="/loginCover2.jpg"
              />
              <div className="w-64 xl:w-full group rounded-lg   p-2  bg-white col-start-1 col-span-3 row-start-3 row-span-2 xl:col-start-1 xl:col-span-5 xl:row-start-3 xl:row-span-2  drop-shadow-lg ">
                <div className="border-2 rounded-lg border-dashed w-full h-full flex flex-col gap-2 justify-center items-center hover:border-blue-400  transition ease-in-out delay-75">
                  <Plus
                    size={42}
                    className="bg-blue-600 rounded-full p-3 group-hover:scale-[110%] transition ease-in-out delay-75"
                    color="white"
                  />
                  <h2 className="font-bold mt-2">New Expense</h2>
                  <h4 className="flex gap-2">
                    or upload <p className="text-green-500">.xls</p> file
                  </h4>
                </div>
              </div>
            </div>
            <div className="hidden pt-10 md:block w-4/5">
              <div className="w-full bg-white py-3  xl:py-6 rounded-lg ">
                <Carousel
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                >
                  <CarouselContent>
                    {financialAdvice.map((advice) => (
                      <CarouselItem key={advice.title}>
                        <div className=" flex-col justify-center px-2 xl:px-10">
                          <h2 className=" font-bold text-xl xl:text-2xl mb-2 text-center">
                            {advice.title}
                          </h2>
                          <p className="text-center">{advice.advice}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
        {/* right part */}
        <div className="h-full md:w-3/5 flex justify-center items-center bg-red-50 md:pt-10  md:bg-white ">
          <div className="w-[90%] xl:w-4/5 xl:ml-auto">
            <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
            <p className="mb-6 text-gray-600">
              Start managing your finance faster and better
            </p>

            <form
              className="w-full  flex flex-col gap-2  rounded-lg xl:w-3/5"
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
              <div className="mt-2 flex justify-end">
                <Button
                  variant="link"
                  className=" text-blue-600"
                  onClick={() => navigate("/reset-password")}
                >
                  Forgot your password?
                </Button>
              </div>
              <Button
                className="my-2 flex items-center bg-theme-secondary justify-center gap-3 "
                variant="default"
                size="lg"
                type="submit"
                disabled={loading}
              >
                Log In
                {loading && active === "password" ? (
                  <Loader className=" animate-spin" />
                ) : (
                  ""
                )}
              </Button>
            </form>
            {/* serperation */}
            <div className="xl:w-3/5 py-4 flex gap-4   justify-center">
              <div className="border-b-2 border-zinc-300 w-1/3  mb-3"></div>
              <p className="text-2xl">or</p>
              <div className="border-b-2 border-zinc-300 w-1/3  mb-3"></div>
            </div>

            {/* auth providers options */}

            <div className="xl:w-3/5 py-4 flex gap-4 ">
              <div className="flex gap-4 w-full">
                <Button
                  className="flex gap-2 items-center bg-theme-secondary w-full justify-center"
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
                  className="flex gap-2 items-center bg-theme-secondary w-full justify-center"
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
            <div className="xl:w-3/5 flex justify-center items-center">
              <p>Don't have an account yet? </p>
              <Button
                variant="ghost"
                className="text-blue-600"
                onClick={() => navigate("/signup")}
              >
                Sign up today.
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
