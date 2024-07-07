import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
type Theme = {
  type: string;
  bgImage?: string;
  bgColor?: string;
  textColor?: string;
  bgSecondary?: string;
};

interface initalThemeInterface {
  theme: Theme | undefined;
  setThemeState: (theme: Theme | undefined) => void;
}

const initalThemeContext: initalThemeInterface = {
  theme: undefined,
  setThemeState: () => null,
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
  return (
    <ThemeContext.Provider value={{ theme, setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): initalThemeInterface => useContext(ThemeContext);
