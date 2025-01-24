"use client";
import MonacoEditor from "@monaco-editor/react";
import { memo } from "react";

const MemorizedMonacoEditor = memo(MonacoEditor)

const code = `
// Fibonacci sequence in JavaScript



function fibonacci(n) {
    const fibSeq = [0, 1];

    for (let i = 2; i < n; i++) {
        fibSeq[i] = fibSeq[i - 1] + fibSeq[i - 2];
    }

    return fibSeq;
}

console.log(fibonacci(10)); 
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
`;


export const MonacoEditorInstanceLanding = (): JSX.Element => {

  // JSX ---------------------------------------

  return (
    <div
      className="bg-primary-background text-white"
    >
      <div className="h-[24px] bg-white">
        <p className="flex items-center py-1 h-full w-full px-5 m-0 text-white bg-primary-color">Javascript</p>
      </div>
      <MemorizedMonacoEditor
        theme="vs-dark"
        height="400px"
        defaultLanguage="javascript"
        value={code}
        options={{
          readOnly: false,
          lineNumbers: "on",
          minimap: { enabled: true },
        }}
      />
    </div>
  );
};