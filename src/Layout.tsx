import { FC } from "react"; // Import FC type from react module
import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
const Layout: FC = () => {
  // Use FC type for Layout component
  return (
    <div className="flex absolute z-[-1]  bg-bgtest bg-no-repeat bg-center bg-cover bg-opacity-40 w-full h-full bg-blend-soft-light bg-zinc-600 ">
      <div className=""></div>
      <SideBar />
      <div className="flex flex-col w-full ">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
