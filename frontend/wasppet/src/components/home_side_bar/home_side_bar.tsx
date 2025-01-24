"use client";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { homesidebar_props } from "@/interfaces/general_use_interfaces";
import { useEffect } from "react";
import { useMainContext } from "@/hooks/main_context";
import LogoutIcon from '@mui/icons-material/Logout';

export const HomeSideBar = ({ props }: homesidebar_props): JSX.Element => {
  // Context --------------------------------------

  const { darkModeEnabled, dataDisplayed, setDataDisplayed } = useMainContext();

  // Tailwind classes ------------------------------

  const menuButtonClasses = `home_sidebar h-[50px] flex items-center px-3 font-medium text-sm cursor-pointer`;

  // Handle events ---------------------------------

  const onMenuButtonClick: React.MouseEventHandler<HTMLDivElement> = (
    e: any
  ) => {
    setDataDisplayed(e.target.id);
  };

  // useEffect --------------------------------------

  useEffect(() => {
    // All buttons (options of data) in the menu
    const menuBtns = [
      "feed",
      "account",
      "notifications",
      "my-snippets",
      "new-post",
      "people",
    ];

    // Get the current inactive options
    const noActiveBtns = menuBtns.filter((btnOption) => {
      return btnOption !== dataDisplayed;
    });

    // Get the current active option
    const activeMenuBtn = document.getElementById(dataDisplayed);

    // Applying styles to the active option - according the theme
    if (activeMenuBtn) {
      activeMenuBtn.style.borderTopLeftRadius = "5px";
      activeMenuBtn.style.borderBottomLeftRadius = "5px";
      if (darkModeEnabled) {
        activeMenuBtn.style.backgroundColor = "var(--primary-background)";
        activeMenuBtn.style.color = "var(--primary-font-color)";

        activeMenuBtn.style.borderTop = "";
        activeMenuBtn.style.borderLeft = "";
        activeMenuBtn.style.borderBottom = "";
      } else {
        activeMenuBtn.style.backgroundColor = "var(--secondary-background)";
        activeMenuBtn.style.color = "var(--primary-background)";

        activeMenuBtn.style.borderTop = "1px solid var(--custom-light-gray)";
        activeMenuBtn.style.borderLeft = "1px solid var(--custom-light-gray)";
        activeMenuBtn.style.borderBottom = "1px solid var(--custom-light-gray)";
      }
    }

    // Applying styles to the inactive options - according the theme
    noActiveBtns?.forEach((option) => {
      const domElement = document.getElementById(option);
      if (domElement) {
        domElement.style.borderTopLeftRadius = "0px";
        domElement.style.borderBottomLeftRadius = "0px";
        if (darkModeEnabled) {
          domElement.style.backgroundColor = "var(--fourth-background)";
          domElement.style.color = "var(--primary-font-color)";

          domElement.style.borderTop = "";
          domElement.style.borderLeft = "";
          domElement.style.borderBottom = "";
        } else {
          domElement.style.backgroundColor = "var(--secondary-background)";
          domElement.style.color = "var(--primary-background)";

          domElement.style.borderTop = "";
          domElement.style.borderLeft = "";
          domElement.style.borderBottom = "";
        }
      }
    });
  }, [dataDisplayed, darkModeEnabled]);

  // JSX ---------------------------------------------

  return (
    <div
      className={`relative flex h-[100%] home_sidebar z-10 flex-col gap-10 transition-left duration-300 py-3 pl-3 sm:w-[200px] sm:left-[-200px] w-[80%] left-[-80%]
        ${props.menuDisplayed ? "sm:left-[0px] left-[0%]" : ""} ${
        darkModeEnabled
          ? "bg-fourth-background"
          : "bg-secondary-background border-r border-r-[1px] border-custom-light-gray"
      }`}
    >
      {/*Dark mode button*/}
      <div
        className={`home_sidebar flex items-center p-[2px] w-[50px] h-[22px] bg-white rounded-2xl ${
          darkModeEnabled ? "" : "border border-[1px] border-custom-light-gray"
        }`}
        onClick={props.onClickDarkMode}
      >
        <div
          className={`home_sidebar flex items-center justify-center text-primary-font-color w-[18px] h-[18px] rounded-[100%] bg-secondary-color transition-all duration-100 ${
            props.darkModeEnabled ? "" : "ml-[26px]"
          }`}
        >
          {props.darkModeEnabled ? (
            <Brightness5Icon sx={{ fontSize: 18 }} />
          ) : (
            <NightsStayIcon sx={{ fontSize: 18 }} />
          )}
        </div>
      </div>
      {/*Dark mode button*/}
      <div>
        <div
          id="feed"
          className={menuButtonClasses}
          onClick={onMenuButtonClick}
        >
          Feed
        </div>
        <div
          id="account"
          className={menuButtonClasses}
          onClick={onMenuButtonClick}
        >
          Account
        </div>
        <div
          id="notifications"
          className={menuButtonClasses}
          onClick={onMenuButtonClick}
        >
          Notifications
        </div>
        <div
          id="my-snippets"
          className={menuButtonClasses}
          onClick={onMenuButtonClick}
        >
          My snippets
        </div>
        <div
          id="new-post"
          className={menuButtonClasses}
          onClick={onMenuButtonClick}
        >
          New post
        </div>
        <div
          id="people"
          className={menuButtonClasses}
          onClick={onMenuButtonClick}
        >
          People
        </div>
        <div className="home_sidebar h-[50px] flex items-center px-3 font-medium text-sm cursor-pointer">
          <div
            className={`flex items-center bg-primary-color py-1 px-4 rounded-md text-primary-font-color`}
            onClick={() => {
              window.localStorage.removeItem("wasppet.dev_user-token");
              window.localStorage.removeItem("wasppet.dev_darktheme");  
              window.location.href = '/';
            }}
          >
            <LogoutIcon sx={{transform: 'scaleX(-1)'}} />
          </div>
        </div>
      </div>
    </div>
  );
};
