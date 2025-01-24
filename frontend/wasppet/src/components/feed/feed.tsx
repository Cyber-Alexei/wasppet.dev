import { getFeedPosts } from "@/controllers/post";
import { post } from "@/interfaces/general_use_interfaces";
import { useMainContext } from "@/hooks/main_context";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "@mui/material/Button";
import { wasppetButtonMUISx } from "@/styles/sx_MUI_styles/wasppet_button";
import { sendEmail } from "@/utils/functions/generation";
import { VAR } from "@/utils/variables";
import { Post } from "@/components/feed/components/post";
import { Search_bar } from "@/components/header/header-components/search_bar/search_bar";
import { useEffect, useState } from "react";

// Functions ------------

function reloadPage() {
  location.reload();
}

// Component ------------

export const FeedComponent = (): JSX.Element => {
  // Context -------------

  const { darkModeEnabled } = useMainContext();

  // State ---------------

  const [reloadPosts, setReloadPosts] = useState<number>(0);
  const [posts, setPosts] = useState<post[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<{
    message: string;
    type: number;
  } | null>(null);
  const [messageContactButton, setMessageContactButton] = useState<
    string | null
  >("Contact wasppet team");
  const [searchBarValue, setSearchBarValue] = useState<string>("");

  // useEffect -----------

  useEffect(() => {
    (async () => {
      const controllerResult = await getFeedPosts({
        searchValue:
          searchBarValue.charAt(0).toUpperCase() +
          searchBarValue.slice(1).toLowerCase(),
      });
      if (controllerResult.success === true) {
        setPosts(controllerResult.detail);
        setErrorMessage(null);
      } else if (
        controllerResult.success === false &&
        controllerResult.detail.Detail === "Not user found"
      ) {
        setErrorMessage({
          message:
            "There was an unexpected error, check you are logged in and refresh the page",
          type: 400,
        });
      } else if (controllerResult.success === false) {
        setErrorMessage({
          message: controllerResult.detail.Detail,
          type: 404,
        });
      }
    })();
  }, [reloadPosts, searchBarValue]);

  // JSX -----------------

  return (
    <div className="w-full">
      <div className="pt-4 flex items-center justify-center">
        <Search_bar
          placeholder="Look for a title, language or tech"
          value={searchBarValue}
          setValue={setSearchBarValue}
        />
      </div>
      {/*IF ERROR*/}
      {errorMessage && (
        <div
          className={`flex flex-col items-center justify-center gap-4 min-h-[300px] w-full rounded-sm p-4 mt-10 font-medium ${
            darkModeEnabled
              ? "bg-fourth-background text-primary-font-color"
              : "bg-gray-100 text-primary-background"
          }`}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: "120px",
              color: `${
                darkModeEnabled
                  ? "var(--primary-font-color)"
                  : "var(--custom-light-gray-2)"
              }`,
            }}
          />
          <p>{errorMessage.message}</p>
          {errorMessage.type === 400 && (
            <div className="flex gap-4 flex-wrap">
              <Button
                variant="contained"
                sx={wasppetButtonMUISx}
                onClick={reloadPage}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                sx={wasppetButtonMUISx}
                onClick={() => {
                  sendEmail(
                    `${VAR.CONTACT_EMAIL}`,
                    "Feed problems",
                    "Please describe the problem:",
                  );
                  setMessageContactButton("Wait a second...");
                  setTimeout(() => {
                    setMessageContactButton("Contact wasppet team");
                  }, 3000);
                }}
              >
                {messageContactButton}
              </Button>
            </div>
          )}
        </div>
      )}
      {/*IF ERROR*/}
      {!errorMessage &&
        posts?.map((post, index) => (
          <div key={index}>
            <Post postItem={post} setReloadPosts={setReloadPosts} />
          </div>
        ))}
    </div>
  );
};
