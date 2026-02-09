import { useContext } from "react";
import { ThemeContext } from "./shared/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500 ${theme === "dark"
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-white/90 text-orange-500 hover:bg-gray-50 shadow-sm border border-gray-200"
                } ${className}`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            <div className="relative w-6 h-6">
                <Sun
                    className={`absolute inset-0 w-6 h-6 transition-all duration-500 rotate-0 scale-100 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : ""
                        }`}
                />
                <Moon
                    className={`absolute inset-0 w-6 h-6 transition-all duration-500 rotate-90 scale-0 opacity-0 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : ""
                        }`}
                />
            </div>
        </button>
    );
}
