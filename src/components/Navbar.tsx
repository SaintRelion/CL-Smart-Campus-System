import { logout, useAuth } from "@saintrelion/auth-lib";
// import UserMenu from "./UserMenu";
import { renderNavItems } from "@saintrelion/routers";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-3 shadow-sm">
      <div className="text-primary text-xl font-semibold">ClassTrack</div>
      <div className="flex items-center gap-4">
        {renderNavItems({
          role: user.role ?? "",
          baseClassName:
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all text-muted-foreground hover:bg-blue-100 hover:text-primary",
          activeClassName:
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all bg-blue-600 text-white pointer-events-none",
        })}
        {/* <UserMenu /> */}
        <button
          onClick={() => {
            logout(async () => {
              window.location.href = "/login";
            });
          }}
          className="cursor-pointer items-center gap-2 bg-red-300 px-4 py-2 text-left text-sm hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
