"use client";
import Link from "next/link";
import Container from "@mui/material/Container";
import { Logo } from "@/components/header/header-components/logo/logo";
import { Menu } from "@/components/header/header-components/menu/menu";
import { MenuInterface } from "@/interfaces/menu_interface";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { wasppetButtonMUISx, wasppetButtonMUISxMovil } from "@/styles/sx_MUI_styles/wasppet_button";

export const Header = (): JSX.Element => {
  // State ---------------------------------
  const [movilMenuActivated, setMovilMenuActivated] = useState<boolean>(false);

  // Get from local storage if a token exists -----

  const wasppetUserToken = window.localStorage.getItem("wasppet.dev_user-token");

  // Menu styles ---------------------------
  const menuData: MenuInterface = {
    buttons: [
      { text: "Sign-Up", route: "/sign-up" },
      {
        text: `${wasppetUserToken ? "Account" : "Log-in"}`,
        route: `${wasppetUserToken ? "/home" : "/log-in"}`,
      },
    ],
    menu_classes: "flex w-[250px] justify-end gap-4",
    buttons_classes: wasppetButtonMUISx,
    material_ui_variant: "outlined",
  };

  // Movil menu styles ----------------------
  const movilMenuData: MenuInterface = {
    buttons: [
      { text: "Sign-Up", route: "/sign-up" },
      {
        text: `${wasppetUserToken ? "Account" : "Log-in"}`,
        route: `${wasppetUserToken ? "/home" : "/log-in"}`,
      },
    ],
    menu_classes: "flex flex-col",
    buttons_classes: wasppetButtonMUISxMovil,
    material_ui_variant: "contained",
  };

  // "capitalize font-opensans text-primary-color"

  // Handle events --------------------------
  const handleMovilMenuClick: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setMovilMenuActivated(!movilMenuActivated);
  };

  // JSX ------------------------------------
  return (
    <header id="header_landing" className="w-full h-[60px] flex items-center bg-fourth-background">
      <Container className="flex items-center justify-between">
        <Link className="w-auto" href="/">
          <Logo styles="text-primary-font-color text-[25px] font-medium inline" />
        </Link>
        <div className="hidden sm:block">
          <Menu data={menuData} />
        </div>
        <div className="flex sm:hidden">
          <IconButton
            aria-label="menu"
            onClick={handleMovilMenuClick}
            className="text-primary-font-color"
          >
            <MenuIcon className="text-primary-font-color" />
          </IconButton>
        </div>
      </Container>
      <div
        className={`absolute sm:hidden h-[calc(100vh-60px)] transition-all duration-300 ease-out 
        bg-primary-background top-[60px] text-red-500 z-10 
        ${movilMenuActivated ? "w-[80vw] opacity-100" : "w-[0px] opacity-0"}`}
      >
        <div className={`${movilMenuActivated ? "" : "hidden"}`}>
          <Menu data={movilMenuData} />
        </div>
      </div>
    </header>
  );
};
