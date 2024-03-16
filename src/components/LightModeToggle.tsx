import React, { SyntheticEvent } from "react";

/*

  Modify the HTML element on switch light/dark mode
*/
export function LightModeToggle() {
  const element = document.querySelector("html");
  const attr = element?.getAttribute("data-theme");
  const [isDarkMode, setIsDarkMode] = React.useState(attr === "dark");

  const onChange = function (event: SyntheticEvent) {
    const text = isDarkMode === true ? "light" : "dark";
    element?.setAttribute("data-theme", text);
    localStorage.setItem("data-theme", text);
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div className="light-mode-toggle">
      <form className="rebel-light-mode__toggle-form">
        <label className="rebel-light-mode__toggle-form-label">
          <input
            type="checkbox"
            role="switch"
            onChange={onChange}
            checked={isDarkMode}
          />{" "}
          Dark mode
        </label>
      </form>
    </div>
  );
}
