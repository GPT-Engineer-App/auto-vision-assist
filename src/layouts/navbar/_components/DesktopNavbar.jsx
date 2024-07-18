import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export const DesktopNavbar = ({ navItems }) => (
  <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-foreground" : "text-muted-foreground"
          )
        }
      >
        {item.title}
      </NavLink>
    ))}
  </nav>
);