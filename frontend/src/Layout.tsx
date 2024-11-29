import { FC } from "react"; // Import FC type from react module
import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";

const Layout: FC = () => {
  // Use FC type for Layout component
  return (
    <div className="flex relative bg-bgtest bg-no-repeat bg-center bg-cover bg-opacity-40 w-full h-full bg-blend-soft-light bg-zinc-600 ">
      <SideBar />
      <div className="flex flex-col w-full h-full md:ml-20 lg:ml-[230px] z-40 ">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
