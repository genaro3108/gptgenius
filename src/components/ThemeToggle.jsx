"use client";
import React, { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

const THEMES = {
  cupcake: "cupcake",
  halloween: "halloween",
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(THEMES.cupcake);

  const toggleTheme = () => {
    const newTheme =
      theme === THEMES.cupcake ? THEMES.halloween : THEMES.cupcake;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === THEMES.cupcake ? (
        <BsMoonFill className="h-4 w-4" />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
