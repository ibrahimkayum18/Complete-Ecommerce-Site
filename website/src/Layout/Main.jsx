import { Outlet } from "react-router-dom";
import Home from "../Pages/Home/Home";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";

const Main = () => {
  return (
    <div>
      <DesktopNavbar />
      <MobileNavbar />
      <Outlet />
    </div>
  );
};

export default Main;
