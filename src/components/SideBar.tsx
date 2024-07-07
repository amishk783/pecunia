import React, { FC, ReactElement } from "react";
import { adminDashboard } from "../Constants/constants";
import { NavLink, Link, useLocation } from "react-router-dom";
import Button from "./Button";
import { cn } from "../lib/utils";
import { Settings, LogOut } from "lucide-react";
import { useTheme } from "../lib/providers/Theme";
interface SideBarProps {
  text: string;
}

const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const { theme, setThemeState } = useTheme();

  const isActivePage = (path: string): boolean => {
    return path === pathname;
  };
  return (
    <div
      className={cn(
        " w-[15%] h-screen glass ",
        // theme?.bgSecondary,
        theme?.textColor
      )}
    >
      <div className="flex flex-col px-5 pt-5 relative overflow-hidden   ">
        <div className="flex justify-between items-center  py-5 border-b-2 border-stone-400 ">
          {/* <img /> */}
          <h1 className=" text-zinc-200 text-3xl drop-shadow-md ">
            AdminDashy
          </h1>
        </div>

        <div className="flex flex-col gap-4 text-xl pt-10 pb-6 ">
          {adminDashboard.map((item) => (
            <Link
              className={`flex gap-4 items-center hover:bg-slate-50 hover:bg-opacity-30  px-5 py-3 rounded-lg ${
                isActivePage(item.pathUrl) ? "bg-slate-50 bg-opacity-30" : ""
              }`}
              to={item.pathUrl}
              key={item.text}
            >
              <item.icon size={36} />
              <h2 className=" font-semibold">{item.text}</h2>
            </Link>
          ))}
        </div>
        <div className="flex pt-5 border-t-2 border-stone-300">
          <div className="flex gap-4 items-center w-full hover:bg-slate-50 hover:bg-opacity-30  px-5 py-3 rounded-lg">
            <Settings size={36} />
            <h2 className="font-semibold text-xl">Settings</h2>
          </div>
        </div>
      </div>
      <div className="gap-4 bottom-0 px-5 py-5 absolute">
        <Button className=" flex gap-4 items-center w-full hover:bg-red-700 hover:bg-opacity-30  pl-5 pr-20 py-3 rounded-lg">
          <LogOut size={36} />
          <h2 className="font-semibold text-xl">Log Out</h2>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
