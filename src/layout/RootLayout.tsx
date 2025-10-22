import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="bg-blue-100">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
