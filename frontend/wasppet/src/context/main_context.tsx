"use client";
import { createContext, useState, SetStateAction, Dispatch, useEffect } from "react";

// Context interface -------------------------------------------

interface mainContextContents {
  darkModeEnabled: boolean;
  setDarkModeEnabled: (stateAction: SetStateAction<boolean>) => void;
  dataDisplayed:
    | "feed"
    | "account"
    | "notifications"
    | "my-snippets"
    | "new-post"
    | "people";
  setDataDisplayed: Dispatch<
    SetStateAction<
      "feed" | "account" | "notifications" | "my-snippets" | "new-post" | "people"
    >
  >;
  menuDisplayed: boolean;
  setMenuDisplayed: (stateAction: SetStateAction<boolean>) => void;
  styles: { [key: string]: any };
  generalModal: {
    message: string;
    type: string;
  } | null;
  setGeneralModal: Dispatch<
    SetStateAction<{
      message: string;
      type: string;
    } | null>
  >;
}

// Context creation --------------------------------------------

export const MainContext = createContext<mainContextContents | undefined>(
  undefined
);

// Provider -----------------------------------------------------

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State --------------------------------------------

  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(true);
  const [dataDisplayed, setDataDisplayed] = useState<
    "feed" | "account" | "notifications" | "my-snippets" | "new-post" | "people"
  >("account");
  const [menuDisplayed, setMenuDisplayed] = useState<boolean>(false);
  ///////////////////////////// Modal
  const [generalModal, setGeneralModal] = useState<{
    message: string;
    type: string;
  } | null>(null);

  // useEffect ---------------------------------------------

  useEffect(() => {
    const darkthemeon = window.localStorage.getItem("wasppet.dev_darktheme");
    if (darkthemeon === "true") {
      setDarkModeEnabled(true)
    } else {
      setDarkModeEnabled(false)
    }
  }, [])

  // Tailwind styles -------------------------------------------

  const styles = {
    label: `font-medium pb-1 ${
      darkModeEnabled ? "text-primary-font-color" : "text-gray-600"
    }`,

    label_2: `font-normal pb-1 ${
      darkModeEnabled ? "text-primary-font-color" : "text-black"
    }`,

    inputs: `focus:outline-none px-2 py-1 ${
      darkModeEnabled
        ? "bg-fourth-background text-primary-font-color"
        : "border border-custom-light-gray"
    }`,

    inputs_new_snippet: `focus:outline-none px-2 py-1 rounded-sm placeholder-custom-light-gray-3`,

    row_div: "flex flex-wrap w-full justify-between h-auto py-1",

    row_div_2: "flex flex-col py-4",

    input_div_2_items: "flex flex-col w-[49%] min-w-[375px]",

    // MUI sx Attribute

    wasppetButtonMUISx_2: {
      boxShadow: "",
      fontWeight: "600",
      border: "none",
      backgroundColor: `${
        darkModeEnabled ? "var(--primary-color)" : "var(--primary-background)"
      }`,
      fontFamily: "'opensans', sans-serif",
      color: "var(--primary-font-color)",
      "&:hover": {
        boxShadow: "none",
      },
      "&:active": {
        boxShadow: "none",
      },
    },
  };

  // All data -----------------------------------------------

  const data = {
    darkModeEnabled,
    setDarkModeEnabled,
    dataDisplayed,
    setDataDisplayed,
    menuDisplayed,
    setMenuDisplayed,
    styles,
    generalModal,
    setGeneralModal,
  };

  // JSX -----------------------------------------------------

  return <MainContext.Provider value={data}>{children}</MainContext.Provider>;
};
