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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme | undefined>();
  const [themePicker, setThemePicker] = useState<boolean>(false);

  useEffect(() => {
    const isTheme = localStorage.getItem("theme");
    if (isTheme) {
      setThemeState(defaultTheme);
    } else {
      localStorage.setItem("theme", defaultTheme.type);
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
