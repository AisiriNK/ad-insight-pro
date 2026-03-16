import { useAppStore } from "@/services/store";
import { Moon, Sun, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Upload" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/insights", label: "AI Insights" },
  { to: "/scenarios", label: "What-If" },
];

export function AppHeader() {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="gradient-text text-lg font-bold">AdAnalytics AI</span>
          </NavLink>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
