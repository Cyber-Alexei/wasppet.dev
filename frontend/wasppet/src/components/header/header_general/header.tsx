"use client";
import Container from "@mui/material/Container";
import Link from "next/link";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { Logo } from "@/components/header/header-components/logo/logo";
import { useMainContext } from "@/hooks/main_context";

export const Header = (): JSX.Element => {
  // Context --------------------------------------------------

  const { darkModeEnabled, setDarkModeEnabled, setDataDisplayed } = useMainContext();

  // Handle events -------------------------------------------

  const onClickDarkMode = () => {
    // Store the new value of theme in local storage
    const changeThemeBooleanValue = !darkModeEnabled;
    localStorage.setItem(
      "wasppet.dev_darktheme",
      JSON.stringify(changeThemeBooleanValue)
    );
    // Chnage the theme
    setDarkModeEnabled(!darkModeEnabled);
  };

  // JSX ------------------------------------------------------

  return (
    <header
      className={`w-full h-[60px] flex items-center border-b border-b-[1-px] z-10 ${
        darkModeEnabled ? "bg-fourth-background border-b-black" : "bg-secondary-background border-b-custom-light-gray"
      }`}
    >
      <Container className="flex items-center justify-between">
        <Link className="w-auto" href="/home" onClick={() => setDataDisplayed("account")}>
          <Logo
            styles={`text-[25px] font-medium ${
              darkModeEnabled
                ? "text-primary-font-color inline"
                : "text-primary-background inline"
            }`}
          />
        </Link>
        {/*Dark mode button*/}
      <div
        className={`home_sidebar flex items-center p-[2px] w-[50px] h-[22px] bg-white rounded-2xl ${darkModeEnabled ? '' : 'border border-[1px] border-custom-light-gray'}`}
        onClick={onClickDarkMode}
      >
        <div
          className={`home_sidebar flex items-center justify-center text-primary-font-color w-[18px] h-[18px] rounded-[100%] bg-secondary-color transition-all duration-100 ${
            darkModeEnabled ? "" : "ml-[26px]"
          }`}
        >
          {darkModeEnabled ? (
            <Brightness5Icon sx={{ fontSize: 18 }} />
          ) : (
            <NightsStayIcon sx={{ fontSize: 18 }} />
          )}
        </div>
      </div>
      {/*Dark mode button*/}
      </Container>
    </header>
  );
};