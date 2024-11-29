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
      setThemeState({
        type: "light",
        bgColor: "bg-zinc-200",
        textColor: "text-black",
        bgSecondary: "bg-stone-300",
      });

      document.documentElement.style.setProperty("--muted", "240 4.8% 95.9%");
    } else if (value === "dark") {
      setThemeState({
        type: "dark",
        bgColor: "bg-[#1d1c1c]",
        textColor: "text-white",
        bgSecondary: "bg-stone-700",
      });
      document.documentElement.style.setProperty("--muted", "240 5% 25%");
    } else {
      setThemeState({
        type: "custom",
        bgColor: " bg-theme-primary",
        textColor: "text-theme-themeText",
        bgSecondary: "bg-theme-secondary",
      });
    }
  };

  console.log(theme?.bgColor);

  return (
    <div
      className={cn(
        "hidden md:flex py-6   w-full items-center justify-between  px-5  ",
        theme?.bgSecondary,
        theme?.textColor
      )}
    >
      <div className="flex gap-2 items-center">
        <Home className={theme?.textColor} size={28} />
        <h3 className="text-xl">/ home / {breadcrumb}</h3>
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
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-3 px-2">
                  <Sun size={24} />
                  <h1 className="text-lg">Light</h1>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-3 px-2 text-slate-700 ">
                  <Moon size={24} />
                  <h1 className="text-lg">Dark</h1>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-3 px-2">
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
