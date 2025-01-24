"use client";
import Container from "@mui/material/Container";
import Link from "next/link";
import { Logo } from "@/components/header/header-components/logo/logo";
import MenuIcon from "@mui/icons-material/Menu";
import { useMainContext } from "@/hooks/main_context";

export const Header = (): JSX.Element => {
  // Context --------------------------------------------------

  const { darkModeEnabled, setMenuDisplayed } = useMainContext();

  // Event handlers ------------------------------------------

  const onClickMenuIcon = () => {
    setMenuDisplayed((menuDisplayed) => !menuDisplayed);
  };

  // JSX ------------------------------------------------------

  return (
    <header
      id="header"
      className={`w-full h-[60px] flex items-center border-b border-b-[1-px] z-10 ${
        darkModeEnabled ? "border-b-black" : "border-b-custom-light-gray"
      }`}
    >
      <Container className="flex items-center justify-between">
        <Link className="w-auto" href="/home">
          <Logo
            styles={`text-[25px] font-medium ${
              darkModeEnabled
                ? "text-primary-font-color inline"
                : "text-primary-background inline"
            }`}
          />
        </Link>
        <MenuIcon
          id="menuIcon"
          sx={{ fontSize: 32 }}
          className={`z-10 block ${
            darkModeEnabled
              ? "text-primary-font-color"
              : "text-custom-light-gray-2"
          }`}
          onClick={onClickMenuIcon}
        />
      </Container>
    </header>
  );
};
