import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/Theme";
export default function ThemeProvider({ children }) {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
}