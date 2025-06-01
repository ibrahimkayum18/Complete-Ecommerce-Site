import { Outlet } from "react-router-dom";
import Home from "../Pages/Home/Home";

const Main = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Main;
