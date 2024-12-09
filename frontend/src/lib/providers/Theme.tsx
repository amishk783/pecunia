import { createContext, useContext, useEffect, useState } from "react";

type Theme = {
  type: string;
  bgImage?: string;
  bgColor?: string;
  textColor?: string;
  bgSecondary?: string;
};

interface initalThemeInterface {
  theme: Theme | undefined;
  themePicker: boolean;
  setThemeState: (theme: Theme | undefined) => void;
  setThemeOpen: () => void;
}

const initalThemeContext: initalThemeInterface = {
  theme: undefined,
  setThemeState: () => null,
  setThemeOpen: () => null,
  themePicker: false,
};
const defaultTheme: Theme = {
  type: "light",
  bgColor: "bg-white",
  bgImage: "",
  textColor: "text-black",
};
const ThemeContext = createContext(initalThemeContext);

interface ThemeConfigType {
  [key: string]: string;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme | undefined>();
  const [themePicker, setThemePicker] = useState<boolean>(false);

  useEffect(() => {
    const isTheme = localStorage.getItem("theme");

    const themeConfig = localStorage.getItem("themeConfig");
    if (isTheme && themeConfig) {
      setThemeState({
        type: "light",
        bgColor: "bg-white",
        bgImage: "",
        textColor: "text-black",
      });
      const parsedConfig: ThemeConfigType = JSON.parse(themeConfig);

      Object.entries(parsedConfig).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value as string);
      });
    } else {
      localStorage.setItem("theme", defaultTheme.type);
      localStorage.setItem(
        "themeConfig",
        JSON.stringify({
          "--background-secondary": "rgb(214 211 209)",
          "--background-primary": "hsl(20, 5.88%, 90%)",
          "--theme-text-color": "#0f172a",
        })
      );
      setThemeState(defaultTheme);
    }
  }, [setThemeState]);
  console.log(theme);
  const setThemeOpen = () => {
    setThemePicker((prev) => !prev);
  };
  return (
    <ThemeContext.Provider
      value={{ theme, setThemeState, setThemeOpen, themePicker }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): initalThemeInterface => useContext(ThemeContext);
