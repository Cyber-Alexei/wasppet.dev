"use client";
import MonacoEditor from "@monaco-editor/react";
import { MonacoInterface } from "@/interfaces/monaco_interface";
import { useMainContext } from "@/hooks/main_context";
import { memo } from "react";

const MemorizedMonacoEditor = memo(MonacoEditor);

export const MonacoEditorInstanceNewSnippet = ({
  data,
  onEditorChange,
}: {
  data: MonacoInterface;
  onEditorChange?: (e: any) => void;
}): JSX.Element => {
  // Context ----------------------------------

  const { darkModeEnabled } = useMainContext();

  // JSX ---------------------------------------

  return (
    <div
      className={`h-full ${
        darkModeEnabled
          ? "bg-primary-background text-white"
          : "bg-secondary-background text-white"
      }`}
    >
      <div className="h-[24px] bg-white">
        <p className="py-0 px-5 m-0 text-white bg-primary-color h-full w-full flex items-center">
          {data.defaultLanguage}
        </p>
      </div>
      <MemorizedMonacoEditor
        theme={`${darkModeEnabled ? "vs-dark" : "vs"}`}
        height="350px"
        defaultLanguage={data.defaultLanguage?.toLowerCase()}
        value={data.value}
        onChange={onEditorChange}
        options={{
          readOnly: false,
          lineNumbers: "on",
          minimap: { enabled: true },
        }}
      />
    </div>
  );
};
