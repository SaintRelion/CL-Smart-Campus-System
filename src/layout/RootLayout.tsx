import Navbar from "@/components/Navbar";
import { useIsPathPublic } from "@saintrelion/routers";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const isPathPublic = useIsPathPublic();

  return (
    <>
      {isPathPublic != "" ? (
        <Outlet />
      ) : (
        <div className="min-h-lvh bg-black/2">
          <Navbar />
          <Outlet />
        </div>
      )}
    </>
  );
};
export default RootLayout;
