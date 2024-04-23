import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar.tsx";
import CustomThemePicker from "./components/CustomThemePicker.tsx";
import { useTheme } from "./lib/providers/Theme.tsx";
import { cn } from "./lib/utils.ts";
function App() {
  const [openCustomPicker, setOpenCustomPicker] = useState<boolean>(false);

  const handleOpenCustomPicker = () => {
    setOpenCustomPicker((prevState) => !prevState);
  };
  const { theme } = useTheme();
  const bgcolor = `bg-[${theme?.bgColor}]`;
  return (
    <main className={cn("w-full h-full", bgcolor)}>
      {openCustomPicker && (
        <CustomThemePicker handleOpen={handleOpenCustomPicker} />
      )}
      <button onClick={handleOpenCustomPicker}>opem</button>

      <Routes>
        <Route path="/" element={""} />
        <Route path="/dashboard" element={""}></Route>
        <Route path="/analytics" element={""}></Route>
        <Route path="/users" element={""}></Route>
        <Route path="/account" element={""}></Route>
        <Route path="/projects" element={""}></Route>
      </Routes>
    </main>
  );
}

export default App;
