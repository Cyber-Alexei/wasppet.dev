import { NextPage } from "next";
import Image from "next/image";
import { MonacoEditorInstanceLanding } from "@/components/monaco_editor/monaco_landing";

const Landing: NextPage = () => {
  return (
    <div>
      <div
        className="
        min-h-[calc(100vh-60px)] min-w-[150px] flex items-center justify-center gap-[70px] flex-wrap w-full
        py-[60px] px-4 bg-amber-200 bg-cover bg-center
        "
      >
        <div className="w-[540px] min-w-[150px] flex flex-col items-center backdrop-blur-md bg-white bg-opacity-40 p-3 rounded-xl">
          <h2 className="text-slate-800 text-title min-w-[150px] pb-3">
            Share development solutions in{" "}
            <span className="text-primary-color overline">snippets</span>.
          </h2>
          <p className="text-[20px] text-slate-800">
            Welcome to the place where developers post objective solutions with
            code snippets.
          </p>
        </div>

        <div className="w-[540px] min-w-[200px]">
          <MonacoEditorInstanceLanding />
        </div>
      </div>
      <div className="flex items-center flex-wrap w-full px-4 py-[100px] bg-fourth-background">
        <div className="w-full h-auto flex flex-col items-center gap-10">
          <div>
            <h2 className="text-primary-font-color text-subtitle flex justify-center pb-3">
              High compatibility with modern languages.
            </h2>
            <p className="text-[20px] text-primary-font-color">
              Wasppet uses the Monaco editor, the same editor on which Visual
              Studio Code is based.
            </p>
          </div>
          <div className="flex justify-between items-center w-full max-w-[300px]">
            <Image
              alt="icon"
              src="/svg/c++.svg"
              width={40}
              height={40}
              className="w-[40px] h-[40px]"
            />

            <Image
              alt="icon"
              src="/svg/javascript-js.svg"
              width={40}
              height={40}
            />

            <Image alt="icon" src="/svg/python.svg" width={40} height={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
