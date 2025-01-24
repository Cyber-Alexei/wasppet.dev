"use client";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useState, Dispatch, SetStateAction} from "react";


export const Search_bar = ({
  placeholder,
  value,
  setValue,
}: {
  placeholder: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}): JSX.Element => {

  // State ------------------------------------
  const [searchActive, setSearchActive] = useState<boolean>(false);

  // Handle events -----------------------------

  const handleSearchDivClick: React.MouseEventHandler<HTMLDivElement> = () => {
    setSearchActive((searchActive) => !searchActive);
  };

  const handleDocumentClick = (e: any) => {
    if (searchActive === false) return;
    const classes = e.target?.className;
    if (typeof classes === "string" && classes.includes("search_bar")) return;
    setSearchActive(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // JS ---------------------------------------

  useEffect(() => {
    const header = document.getElementById("header");
    const body = document.getElementById("body-id");

    header?.addEventListener("click", handleDocumentClick);
    body?.addEventListener("click", handleDocumentClick);

    return () => {
      header?.removeEventListener("click", handleDocumentClick);
      body?.removeEventListener("click", handleDocumentClick);
    };
  }, [searchActive]);

  // JSX ---------------------------------------

  return (
    <div
      className={`relative flex justify-end transition-all bg-white
        duration-100 items-center rounded-tl-[30px] rounded-bl-[30px] rounded-tr-[50px] rounded-br-[50px] h-[30px]
        ${searchActive ? "w-[270px]" : "w-[30px]"}`}
    >
      <div
        className="absolute right-[-2px] rigth-0 z-4 flex justify-center items-center 
        w-[37px] cursor-pointer h-[37px] rounded-[100%] bg-primary-color text-white"
        onClick={handleSearchDivClick}
      >
        {searchActive ? <CancelIcon /> : <SearchIcon />}
      </div>
      <input
        className={`search_bar h-[20px] caret-black text-primary-background outline-none mx-[10px] w-[100%] custom-placeholder-font-size bg-white 
          ${searchActive ? "pr-[35px]" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={handleSearchInputChange}
      />
    </div>
  );
};
