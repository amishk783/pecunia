import React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Settings, LogOut, Home, ChevronLeft } from "lucide-react";
import { useTheme } from "../lib/providers/Theme";

import { adminDashboard } from "../constants/constants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/providers/AuthProvider";

interface Props {
  className?: string;
  onSidebarClose?: () => void;
}

const SideBar: React.FC<Props> = ({ className, onSidebarClose }) => {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  const isActivePage = (path: string): boolean => {
    return path === pathname;
  };

  const { logOut } = useAuth();
  return (
    <div
      className={cn(
        " w-20 lg:w-[230px] bg-theme-secondary hidden text-theme-themeText h-full fixed  md:flex bottom-0 top-0 left-0 flex-col z-10   ",
        className
      )}
    >
      <div className="flex flex-col px-5 pt-5 relative   ">
        <div className="flex justify-between items-center relative  py-5 border-b-2 border-stone-400 ">
          {/* <img /> */}
          <h1
            className={cn(
              " text-zinc-200 text-3xl  text-theme-themeText drop-shadow-md md:hidden lg:block "
            )}
          >
            Pecunia
          </h1>
          <div className="max-sm:hidden w-full h-full  lg:hidden">
            <img  width={500} height={100} src="/logo.png" alt="logo"></img>
          </div>
          <div
            onClick={onSidebarClose}
            className=" flex items-center md:hidden justify-center rounded-full absolute -right-9 text-red-700 z-50 w-10  h-10 bg-theme-primary "
          >
            <ChevronLeft className="" />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-xl pt-10 pb-6 ">
          {adminDashboard.map((item) => (
            <Link
              className={`flex gap-4 items-center    lg:px-5 py-3 rounded-lg ${
                isActivePage(`/${item.pathUrl}`)
                  ? ` ${theme?.bgSecondary} `
                  : ""
              }`}
              to={item.pathUrl}
              key={item.text}
            >
              <item.icon size={36} />
              <h2 className=" md:hidden lg:block font-semibold">{item.text}</h2>
            </Link>
          ))}
        </div>
        <div className="flex pt-5 border-t-2 border-stone-300">
          <Link
            className={`flex gap-4 items-center   lg:px-5 py-3 rounded-lg ${
              isActivePage("") ? "bg-slate-50 bg-opacity-30" : ""
            }`}
            to={"/app/settings"}
          >
            <Settings size={36} />
            <h2 className="md:hidden lg:block font-semibold text-xl">
              Settings
            </h2>
          </Link>
        </div>
      </div>
      <div className="gap-4 bottom-0 px-5 py-5 absolute w-full">
        <Button
          onClick={logOut}
          className=" flex gap-4 items-center w-full  hover:bg-opacity-30 hover:text-red-600  py-3 rounded-lg"
        >
          <LogOut size={36} />
          <h2 className="hidden lg:block font-semibold text-xl ">Log Out</h2>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
