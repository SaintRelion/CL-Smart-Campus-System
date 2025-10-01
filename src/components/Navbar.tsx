import { useAuth } from "@saintrelion/auth-lib";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { renderNavItems } from "@saintrelion/routers";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      <Link to="/" className="text-primary text-xl font-semibold">
        ClassTrack
      </Link>
      <div className="flex items-center gap-4">
        {renderNavItems({
          role: user.role ?? "",
          baseClass:
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-primary",
          activeClass: "bg-black text-white pointer-events-none",
        })}
        <UserMenu />
      </div>
    </nav>
  );
};
export default Navbar;
