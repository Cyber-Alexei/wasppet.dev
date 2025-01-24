"use client";
import MonacoEditor from "@monaco-editor/react";
import { getSingleSnippet } from "@/controllers/snippet";
import { savedSnippetData } from "@/interfaces/general_use_interfaces";
import { useMainContext } from "@/hooks/main_context";
import { usePostContext } from "@/hooks/post_context";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { memo, useEffect, useState } from "react";

const MemorizedMonacoEditor = memo(MonacoEditor);

export const MonacoEditorInstancePostCreation = ({
  snippetId,
  onUpItem,
  onDownItem,
  onDeleteItem,
}: {
  snippetId: number;
  onUpItem: () => void;
  onDownItem: () => void;
  onDeleteItem: () => void;
}): JSX.Element => {
  // Context -----------------------------------

  const { darkModeEnabled } = useMainContext();
  const { styles } = usePostContext();

  // State -------------------------------------

  const [snippet, setSnippet] = useState<savedSnippetData | null>(null);

  // useEffect ---------------------------------

  useEffect(() => {
    (async () => {
      const controllerResult = await getSingleSnippet({ id: snippetId });
      if (controllerResult.success === true) {
        setSnippet(controllerResult.detail);
      }
    })();
  }, [snippetId]);

  // JSX ---------------------------------------
  if (snippet === null) {
    return <div></div>;
  }

  return (
    <div className="flex text-white">
      <div className="flex items-center justify-center flex-col">
        <div onClick={onUpItem} className={styles.itemButtons}>
          <ArrowDropUpIcon />
        </div>
        <div onClick={onDownItem} className={styles.itemButtons}>
          <ArrowDropDownIcon />
        </div>
      </div>
      <div className="w-full">
        <div className="h-[24px] bg-white">
          <p className="flex items-center bg-primary-color py-1 h-full w-full px-5 m-0">
            {snippet?.language_name?.value}
          </p>
        </div>
        <MemorizedMonacoEditor
          theme={darkModeEnabled ? "vs-dark" : "vs"}
          height="400px"
          defaultLanguage={snippet?.language_name?.value.toLowerCase()}
          value={snippet?.code}
          options={{
            readOnly: true,
            lineNumbers: "on",
            minimap: { enabled: true },
          }}
        />
      </div>
      <div onClick={onDeleteItem} className={styles.itemButtons}>
        <DeleteOutlineIcon />
      </div>
    </div>
  );
};
