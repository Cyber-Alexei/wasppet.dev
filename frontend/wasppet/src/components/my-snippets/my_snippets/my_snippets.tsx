import { getAllUserSnippets, deleteSnippet } from "@/controllers/snippet";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useMainContext } from "@/hooks/main_context";
import { useMonacoContext } from "@/hooks/monaco_context";
import { savedSnippetData as snippetData } from "@/interfaces/general_use_interfaces";
import { MonacoInterface } from "@/interfaces/monaco_interface";
import { MonacoEditorInstanceMySnippets } from "@/components/monaco_editor/monaco_my_snippets";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { DeleteSnippetModal } from "@/components/modal/delete_snippet_modal";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

export const MySnippets = ({
  changeTab,
  searchBarValue,
}: {
  changeTab: Dispatch<SetStateAction<number>>;
  searchBarValue: string;
}): JSX.Element => {
  // Context ----------------------------------

  const { userAuth, setReloadUserAuthData } = useUserAuthContext();
  const { darkModeEnabled } = useMainContext();
  const { setForm } = useMonacoContext();

  // State ------------------------------------

  const [snippets, setSnippets] = useState<snippetData[] | null>(null);
  const [selectedSnippetId, setSelectedSnippetId] = useState<number | null>(
    null
  );
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  //const [reload, setReload] = useState<number>(0);
  const [snippetsPaginationPage, setSnippetsPaginationPage] =
    useState<number>(1);
  const [paginationLength, setPaginationLength] = useState<null | number>(null);

  // Event handler ----------------------------

  const onClickToDeleteProcess = async (snippet_id: number) => {
    setSelectedSnippetId(snippet_id);
    setShowConfirmation(true);
  };

  const onClickToConfirmDelete = async () => {
    if (selectedSnippetId === null) return;
    const controllerResponse = await deleteSnippet(selectedSnippetId);
    if (controllerResponse.success === true) {
      setShowConfirmation(false);
      setReloadUserAuthData(prevState => prevState + 1)
      //setReload(reload + 1);
    }
  };

  const onClickToEditSnippet = (snippet: snippetData) => {
    setForm({
      id: snippet.id,
      updated_at: snippet.updated_at,
      user: snippet.user,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language_name,
      technology: snippet.technology_names,
    });

    // Redirect to "new snippet" tab. Tabs component of Material UI set the displayed tab
    // using its state "value" which is a zero indexed number, each number is a different tab
    // 0 is the "new snippet tab". The function to set the MUI "value" state is "changeTab" and
    // was passed as prop
    changeTab(0);
  };

  // useEffect --------------------------------

  useEffect(() => {
    (async () => {
      if (!userAuth) return; 
      const response = await getAllUserSnippets({
        user_id: userAuth?.id,
        paginationPage: snippetsPaginationPage,
        query: searchBarValue,
      });
      if (response.success === true) {
        setSnippets(response.detail.results);
        setPaginationLength(Math.ceil(response.detail.count / 4));
      } else {
        setSnippets(null);
      }
      
    })();
  }, [userAuth, snippetsPaginationPage, searchBarValue]);

  // Functions -------------------------------

  const serchSnippetToDelete = (snippetId: number) => {
    if (snippetId === selectedSnippetId) return true;
    return false;
  };

  // Tailwind --------------------------------

  const buttonStyles = `px-2 cursor-pointer h-full w-full flex items-center justify-center ${
    darkModeEnabled ? "text-primary-font-color" : "text-primary-background"
  }`;

  // JSX --------------------------------------

  return (
    <div className="pb-8 ">
      <div className="flex gap-4 w-full mb-[16px] items-center px-2">
        <div
          className="bg-primary-color rounded-sm px-3"
          onClick={() => {
            if (snippetsPaginationPage === 1) return;
            setSnippetsPaginationPage((prevState) => prevState - 1);
          }}
        >
          <ArrowLeftIcon />
        </div>
        <div
          className="bg-primary-color rounded-sm px-3"
          onClick={() => {
            if (snippetsPaginationPage === paginationLength) return;
            setSnippetsPaginationPage((prevState) => prevState + 1);
          }}
        >
          <ArrowRightIcon />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center h-auto">
        {snippets &&
          snippets.map((snippetObj) => {
            // Data for the editor ----------------------
            const monacoEditorInstanceData: MonacoInterface = {
              defaultLanguage: snippetObj.language_name?.value || null,
              value: snippetObj.code,
            };

            return (
              <div
                key={snippetObj.id}
                className="relative w-full lg:w-[49%] lg:min-w-[350px] h-auto"
              >
                <div
                  className={`w-[100%] rounded-tl-sm rounded-tr-sm ${
                    darkModeEnabled
                      ? "border border-black"
                      : "border border-custom-light-gray"
                  }`}
                >
                  <div className="p-1">
                    <MonacoEditorInstanceMySnippets
                      data={monacoEditorInstanceData}
                    />
                  </div>
                  {/* INFO */}
                  <div
                    className={`flex justify-between w-full h-[30px] rounded-bl-sm rounded-br-sm ${
                      darkModeEnabled
                        ? "bg-fourth-background text-primary-font-color"
                        : "bg-gray-200 text-primary-background"
                    }`}
                  >
                    <div className="px-4 flex items-center">
                      {snippetObj.title}
                    </div>
                    <div className="flex gap-1 px-2">
                      <div
                        className={buttonStyles}
                        onClick={() => onClickToEditSnippet(snippetObj)}
                      >
                        <EditIcon sx={{ fontSize: 20 }} />
                      </div>
                      <div
                        className={buttonStyles}
                        onClick={() => onClickToDeleteProcess(snippetObj.id)}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                      </div>
                    </div>
                  </div>
                  {/* INFO */}
                </div>
                {showConfirmation && serchSnippetToDelete(snippetObj.id) && (
                  <DeleteSnippetModal
                    onClickToConfirmDelete={onClickToConfirmDelete}
                    setShowConfirmation={setShowConfirmation}
                    setSelectedSnippetId={setSelectedSnippetId}
                  />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
