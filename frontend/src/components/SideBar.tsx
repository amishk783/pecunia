import React from "react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Settings, LogOut, Home } from "lucide-react";
import { useTheme } from "../lib/providers/Theme";

import { adminDashboard } from "../constants/constants";
import { Button } from "@/components/ui/button";

const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  console.log(theme);
  const isActivePage = (path: string): boolean => {
    console.log(path === pathname);
    return path === pathname;
  };
  return (
    <div
      className={cn(
        " w-20 lg:w-[230px] h-full fixed hidden md:flex bottom-0 top-0 left-0 flex-col z-10   ",
        theme?.bgColor,
        theme?.textColor
      )}
    >
      <div className="flex flex-col px-5 pt-5 relative overflow-hidden   ">
        <div className="flex justify-between items-center  py-5 border-b-2 border-stone-400 ">
          {/* <img /> */}
          <h1
            className={cn(
              " text-zinc-200 text-3xl drop-shadow-md hidden lg:block ",
              theme?.textColor
            )}
          >
            Pecunia
          </h1>
          <Home size={36} className=" lg:hidden" />
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
              <h2 className=" hidden lg:block font-semibold">{item.text}</h2>
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
            <h2 className="hidden lg:block font-semibold text-xl">Settings</h2>
          </Link>
        </div>
      </div>
      <div className="gap-4 bottom-0 px-5 py-5 absolute">
        <Button className=" flex gap-4 items-center w-full hover:bg-red-700 hover:bg-opacity-30 lg:pl-5 lg:pr-20 py-3 rounded-lg">
          <LogOut size={36} />
          <h2 className="hidden lg:block font-semibold text-xl">Log Out</h2>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
