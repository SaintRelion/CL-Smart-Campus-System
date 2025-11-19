import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-lvh bg-black/2">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
