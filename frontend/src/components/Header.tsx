import { Sun, Home, Mail, Moon, Wrench } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../lib/providers/Theme";
import { cn } from "../lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const breadcrumb = pathname.slice(1, pathname.length);
  const { setThemeOpen } = useTheme();

  const { theme, setThemeState } = useTheme();

  const handleTheme = (value: string) => {
    console.log(value);

    if (value === "light") {
      document.documentElement.style.setProperty(
        "--background-primary",
        "hsl(20, 5.88%, 90%)"
      );

      localStorage.setItem(
        "themeConfig",
        JSON.stringify({
          "--background-secondary": "rgb(214 211 209)",
          "--background-primary": "hsl(20, 5.88%, 90%)",
          "--theme-text-color": "#0f172a",
        })
      );

      document.documentElement.style.setProperty(
        "--background-secondary",
        "rgb(214 211 209)"
      );
      document.documentElement.style.setProperty(
        "--theme-text-color",
        "#0f172a"
      );
      // setThemeState({
      //   type: "light",
      //   bgColor: "bg-zinc-200",
      //   textColor: "text-black",
      //   bgSecondary: "bg-stone-300",
      // });
      document.documentElement.style.setProperty("--muted", "hsl(240 7.8% 75.9%)");
    } else if (value === "dark") {
      document.documentElement.style.setProperty(
        "--background-primary",
        "#1d1c1c"
      );

      document.documentElement.style.setProperty(
        "--background-secondary",
        "#44403c"
      );
      localStorage.setItem(
        "themeConfig",
        JSON.stringify({
          "--background-secondary": "#44403c",
          "--background-primary": "#1d1c1c",
          "--text-theme-themeText": "#fffff",
        })
      );
      document.documentElement.style.setProperty(
        "--theme-text-color",
        "#ffffff"
      );

      document.documentElement.style.setProperty("--muted", "240 5% 25%");
      // setThemeState({
      //   type: "dark",
      //   bgColor: "bg-[#1d1c1c]",
      //   textColor: "text-white",
      //   bgSecondary: "bg-stone-700",
      // });
    } else {
      // setThemeState({
      //   type: "custom",
      //   bgColor: " bg-theme-primary",
      //   textColor: "text-theme-themeText",
      //   bgSecondary: "bg-theme-secondary",
      // });
    }
  };

  return (
    <div
      className={cn(
        "hidden md:flex py-6     bg-theme-primary text-theme-themeText w-full items-center justify-between  px-5  ",
        theme?.bgSecondary,
        theme?.textColor
      )}
    >
      <div className="flex gap-2 items-center">
        <Home className=" text-theme-themeText" size={28} />
        <h3 className="text-xl text-theme-themeText">/ home / {breadcrumb}</h3>
      </div>
      <div className="flex items-center ">
        <div className="flex gap-4 items-center  ">
          <Button
            className="rounded-md"
            variant="outline"
            onClick={() => setThemeOpen()}
          >
            Theme
          </Button>
          <Select onValueChange={handleTheme}>
            <SelectTrigger className="w-[140px] bg-theme-primary ">
              <SelectValue
                className="text-theme-themeText"
                placeholder={theme?.type}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center text-theme-themeText gap-3 px-2">
                  <Sun size={24} />
                  <h1 className="text-lg">Light</h1>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center text-theme-themeText gap-3 px-2 text-slate-700 ">
                  <Moon size={24} />
                  <h1 className="text-lg">Dark</h1>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center text-theme-themeText gap-3 px-2 ">
                  <Wrench size={24} />
                  <h1 className="text-lg">Custom</h1>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {/* <Sun className={theme?.textColor} size={28} /> */}
          <Mail className={theme?.textColor} size={28} />
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default Header;
