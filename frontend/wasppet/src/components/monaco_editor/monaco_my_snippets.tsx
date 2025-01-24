"use client";
import MonacoEditor from "@monaco-editor/react";
import { MonacoInterface } from "@/interfaces/monaco_interface";
import { useMainContext } from "@/hooks/main_context";
import { memo } from "react";

const MemorizedMonacoEditor = memo(MonacoEditor);

export const MonacoEditorInstanceMySnippets = ({
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
    <div>
      <div className="h-[24px] bg-white">
        <p className="py-0 px-5 m-0 text-white bg-primary-color h-full w-full flex items-center">
          {data.defaultLanguage}
        </p>
      </div>
      <MemorizedMonacoEditor
        theme={`${darkModeEnabled ? "vs-dark" : "vs"}`}
        height="300px"
        defaultLanguage={data.defaultLanguage?.toLowerCase()}
        value={data.value}
        onChange={onEditorChange}
        options={{
          readOnly: true,
          lineNumbers: "on",
          minimap: { enabled: true },
        }}
      />
    </div>
  );
};