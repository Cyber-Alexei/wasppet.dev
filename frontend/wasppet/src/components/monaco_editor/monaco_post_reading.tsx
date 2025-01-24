"use client";
import { savedSnippetData } from "@/interfaces/general_use_interfaces";
import { useMainContext } from "@/hooks/main_context";
import MonacoEditor from "@monaco-editor/react";
import { memo } from "react";

const MemorizedMonacoEditor = memo(MonacoEditor);

export const MonacoEditorInstancePostReading = ({
  snippetData,
}: {
  snippetData: savedSnippetData;
}): JSX.Element => {
  // Context ----------------------------------

  const { darkModeEnabled } = useMainContext();

  // JSX ---------------------------------------
  if (snippetData === null) {
    return <div></div>;
  }

  return (
    <div
      className={`${
        darkModeEnabled
          ? "bg-primary-background text-white"
          : "bg-gray-100 text-primary-background"
      }`}
    >
      <div className="h-[24px] bg-white">
        <p className="flex items-center py-1 h-full w-full px-5 m-0 text-white bg-primary-color">
          {snippetData?.language_name?.value}
        </p>
      </div>
      <MemorizedMonacoEditor
        theme={darkModeEnabled ? "vs-dark" : "vs"}
        height="400px"
        defaultLanguage={snippetData?.language_name?.value.toLowerCase()}
        value={snippetData?.code}
        options={{
          readOnly: true,
          lineNumbers: "on",
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};
