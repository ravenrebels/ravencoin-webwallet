import React, { SyntheticEvent } from "react";

export function LightModeToggle() {
  const element = document.querySelector("html");
  const attr = element?.getAttribute("data-theme");
  const [isDarkMode, setIsDarkMode] = React.useState(attr === "dark");

  const onChange = function (event: SyntheticEvent) {
    const text = isDarkMode === true ? "light" : "dark";
    element?.setAttribute("data-theme", text);
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div className="light-mode-toggle">
      <form  className="rebel-light-mode__toggle-form">
        <label  className="rebel-light-mode__toggle-form-label">
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

function Moon() {
  //Icon from https://feathericons.com/?query=moon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-moon"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  );
}
