import { useMainContext } from "@/hooks/main_context";
import { usePostContext } from "@/hooks/post_context";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { postEngineItem } from "@/interfaces/general_use_interfaces";
import { getAllUserSnippets } from "@/controllers/snippet";
import {
  savedSnippetData,
  newSnippetFormSelect,
} from "@/interfaces/general_use_interfaces";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Search_bar } from "@/components/header/header-components/search_bar/search_bar";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import { post } from "@/interfaces/general_use_interfaces";
import { createNewPost, updatePost } from "@/controllers/post";
import { useEffect, useState } from "react";

export const NewPostComponent = (): JSX.Element => {
  // Context -----------------------------

  const { darkModeEnabled, generalModal, setGeneralModal } = useMainContext();
  const { userAuth, setReloadUserAuthData } = useUserAuthContext();
  const {
    items,
    setItems,
    orderedItems,
    postInUpdateId,
    tagItemSetter,
    tagItemBuilder,
    uniqueH1TitleBuilder,
    tagSnippetSetter,
    tagSnippetBuilder,
    setPostInUpdateId,
    setCounter,
  } = usePostContext();

  // State ------------------------------

  const [showSnippetSelection, setShowSnippetSelection] =
    useState<boolean>(false);
  const [userSnippets, setUserSnippets] = useState<null | savedSnippetData[]>(
    null,
  );
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [paginationLength, setPaginationLength] = useState<number | null>(null);
  const [searchBarValue, setSearchBarValue] = useState<string>("");

  // Functions -------------------------

  const savePost = async () => {
    // Obtain the H1
    const h1 = orderedItems.find((item) => {
      return item.item === "h1-1";
    });

    // Validate the new post form
    if (!h1?.value || !orderedItems[1] || orderedItems[1].value === "") {
      setGeneralModal({
        message: "No empty posts or without a title are allowed",
        type: "error",
      });
    }

    // Prepare the data...

    // Obtain the snippets IDs
    const snippetsIds: number[] = [];
    // Obtain the languages IDs of all snippets
    const snippetsLanguages: number[] = [];
    // Obtain the technologies IDs of all snippets
    const snippetTechnologies: number[] = [];
    // Obtain the languages names (obj)
    const languagesNames: string[] = [];
    // Obtain the technologies names (obj)
    const technologiesNames: string[] = [];
    // Iterate the data
    orderedItems.map((item) => {
      if (item?.snippet?.snippetId) {
        // languagesNames
        languagesNames.push(item.snippet.language_name.value);
        // technologiesNames
        item.snippet.technology_names.map((item: newSnippetFormSelect) => {
          technologiesNames.push(item.value);
        });
        // snippetsIds
        if (!snippetsIds.includes(item.snippet.snippetId)) {
          snippetsIds.push(item.snippet.snippetId);
        }
        // snippetsLanguages
        if (!snippetsLanguages.includes(item.snippet.language)) {
          snippetsLanguages.push(item.snippet.language);
        }
        // snippetTechnologies
        item.snippet.technology.map((item: number) => {
          if (!snippetTechnologies.includes(item)) {
            snippetTechnologies.push(item);
          }
        });
      }
    });

    // Organized the data to create the post

    // Filter to protect the execution and validate TypeScript calls
    if (!userAuth?.id || !h1?.value) return;

    // Data
    const dataToSend: post = {
      title: h1.value,
      user: userAuth.id,
      snippets: snippetsIds,
      share_url: `posts/${userAuth?.username}/${h1?.value}/`
        .trim()
        .replace(/ /g, "-")
        .toLowerCase(),
      languages: snippetsLanguages,
      languages_names: languagesNames,
      technologies: snippetTechnologies,
      technologies_names: technologiesNames,
      post: items,
      updated_at: new Date(),
    };

    // Value of the controller

    let controllerResult;

    // Save (no Id) or update (there is an Id)

    if (postInUpdateId) {
      controllerResult = await updatePost({ dataToSend, postInUpdateId });
      // Set the context state of post in update mode to null again
      // (there is no a post being updated anymore ones the current one is finished)
      setPostInUpdateId(null);
    } else {
      controllerResult = await createNewPost(dataToSend);
    }

    // Show the modal with a message

    if (controllerResult?.success === true) {
      setGeneralModal({ message: "Post saved!", type: "success" });
      // Reset the post form
      setItems({
        "h1-1": { item: "h1-1", order: 1, value: "" },
      });
    } else {
      setGeneralModal({ message: "An error has ocurred", type: "error" });
    }

    // Close the container to show and select snippets for the post
    setShowSnippetSelection(false);
    // Show the new post or updated post in the user profile
    setReloadUserAuthData((prevState) => prevState + 1);
  };

  // useEffect --------------------------

  useEffect(() => {
    (async () => {
      if (!userAuth) return;
      const controllerResult = await getAllUserSnippets({
        user_id: userAuth.id,
        paginationPage: paginationPage,
        query: searchBarValue,
      });
      if (controllerResult.success !== true) return;
      setUserSnippets(controllerResult.detail.results);
      setPaginationLength(Math.ceil(controllerResult.detail.count / 4));
    })();
  }, [paginationPage, searchBarValue, userAuth]);

  useEffect(() => {
    setCounter(orderedItems.length + 1);
  }, [orderedItems.length, setCounter]);

  // Tailwind ---------------------------

  const controlStyles = `border-r py-1 px-3 cursor-pointer filter transition-all duration-300 ${
    darkModeEnabled
      ? "bg-primary-color hover:brightness-110"
      : "bg-custom-light-gray-2 hover:bg-custom-light-gray"
  }`;

  const arrowStyles = `px-3 rounded-sm cursor-pointer filter bg-primary-color hover:brightness-110 transition-all duration-300`;

  // JSX ---------------------------------

  return (
    <div
      className={`absolute flex flex-col w-full pt-6 pb-10 ${
        generalModal ? "max-h-[calc(100vh-60px)] overflow-hidden" : "h-auto"
      }`}
    >
      <div className="h-auto px-[108px]">
        <div
          id="postEngineTemplateDiv"
          className={`flex flex-col gap-4 border min-h-[100px] h-auto p-4 ${
            darkModeEnabled ? "border-black" : "border-custom-light-gray"
          }`}
        >
          {/*------POSTENGINE-----*/}
          {orderedItems.map((itemObj: postEngineItem): any => {
            console.log(orderedItems, "aITEMS");
            const itemNameNextCharacterIndex = itemObj.item.indexOf("-");
            const itemName =
              itemNameNextCharacterIndex > -1
                ? itemObj.item.substring(0, itemNameNextCharacterIndex)
                : itemObj.item;

            if (itemName === "h1") {
              const component: any = uniqueH1TitleBuilder();
              return <div key={itemObj.item}>{component}</div>;
            }

            if (["h2", "h3", "h4", "h5", "h6"].includes(itemName)) {
              const component: any = tagItemBuilder(itemObj.item);
              return <div key={itemObj.item}>{component}</div>;
            }

            if (itemName === "p") {
              const component: any = tagItemBuilder(itemObj.item);
              return <div key={itemObj.item}>{component}</div>;
            }

            if (itemName === "snippet") {
              if (!itemObj.snippet) return;
              const component: any = tagSnippetBuilder(
                itemObj.item,
                itemObj.snippet,
              );
              return <div key={itemObj.item}>{component}</div>;
            }

            return;
          })}
          {/*------POSTENGINE-----*/}
          <div className="flex gap-4">
            <div
              className={`${arrowStyles} text-primary-font-color w-[100px] text-center font-medium`}
              onClick={savePost}
            >
              Save
            </div>
          </div>
        </div>
        {/*----------MENU--------*/}
        <div className="flex justify-center w-full bottom-0 mt-4 w-auto">
          <div className="flex text-primary-font-color font-medium rounded-lg">
            <div
              className={`border-r py-1 px-3 cursor-pointer filter rounded-tl-lg rounded-bl-lg transition-all duration-300 ${
                darkModeEnabled
                  ? "bg-primary-color hover:brightness-110"
                  : "bg-custom-light-gray-2 hover:bg-custom-light-gray"
              }`}
              onClick={() => tagItemSetter("h2")}
            >
              H2
            </div>
            <div className={controlStyles} onClick={() => tagItemSetter("h3")}>
              H3
            </div>
            <div className={controlStyles} onClick={() => tagItemSetter("h4")}>
              H4
            </div>
            <div className={controlStyles} onClick={() => tagItemSetter("h5")}>
              H5
            </div>
            <div className={controlStyles} onClick={() => tagItemSetter("h6")}>
              H6
            </div>
            <div className={controlStyles} onClick={() => tagItemSetter("p")}>
              P
            </div>
            <div
              className={`py-1 px-3 cursor-pointer filter rounded-tr-lg rounded-br-lg transition-all duration-300 ${
                darkModeEnabled
                  ? "bg-primary-color hover:brightness-110"
                  : "bg-custom-light-gray-2 hover:bg-custom-light-gray"
              }`}
              onClick={() => setShowSnippetSelection((prevState) => !prevState)}
            >
              {showSnippetSelection ? <DoNotDisturbOnIcon /> : "Snippet"}
            </div>
          </div>
        </div>
        {/*----------MENU--------*/}
        {/*-------SNIPPET SELECTION-------*/}
        {showSnippetSelection && (
          <div
            className={`flex flex-wrap items-center justify-center my-4 min-h-[75px] w-full rounded-sm gap-4 pb-[16px] ${
              darkModeEnabled ? "bg-fourth-background" : "bg-gray-100"
            }`}
          >
            {userSnippets === null ? (
              <p>
                You don't have snippets, create one in "My snippets" section
              </p>
            ) : (
              <div className="flex flex-col w-full">
                <div className="py-4 mx-auto">
                  <Search_bar
                    placeholder="Look for a title"
                    value={searchBarValue}
                    setValue={setSearchBarValue}
                  />
                </div>
                <div className="flex gap-4 justify-center items-center">
                  {userSnippets.map((snippet) => {
                    return (
                      <div key={snippet.id}>
                        <div
                          className={`flex justify-center items-center transition-all duration-300 rounded-sm w-[75px] h-[75px] ${
                            darkModeEnabled
                              ? "bg-white hover:opacity-80"
                              : "bg-custom-light-gray-2 text-primary-font-color filter hover:bg-custom-light-gray"
                          }`}
                          onClick={() =>
                            tagSnippetSetter("snippet", {
                              snippetId: snippet.id,
                              language: snippet.language,
                              language_name: snippet.language_name,
                              technology: snippet.technology,
                              technology_names: snippet.technology_names,
                            })
                          }
                        >
                          <p className="text-center">
                            {snippet.title.substring(0, 10) + "."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex gap-4 w-full items-center justify-center px-2">
              <div
                className={arrowStyles}
                onClick={() => {
                  if (paginationPage === 1) return;
                  setPaginationPage((prevState) => prevState - 1);
                }}
              >
                <ArrowLeftIcon />
              </div>
              <div
                className={arrowStyles}
                onClick={() => {
                  if (paginationPage === paginationLength) return;
                  setPaginationPage((prevState) => prevState + 1);
                }}
              >
                <ArrowRightIcon />
              </div>
            </div>
          </div>
        )}
        {/*------SNIPPET SELECTION--------*/}
      </div>
    </div>
  );
};
