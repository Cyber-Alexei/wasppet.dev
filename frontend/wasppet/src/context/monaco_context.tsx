"use client";
import { createContext, useState, Dispatch, SetStateAction } from "react";
import {
  newSnippetForm,
} from "@/interfaces/general_use_interfaces";

// Context interface ----------------------

interface monacoContextContents {
  form: newSnippetForm;
  setForm: Dispatch<SetStateAction<newSnippetForm>>;
}

// Create context -------------------------

export const MonacoContext = createContext<monacoContextContents | undefined>(
  undefined
);

// Provider ------------------------------

export const MonacoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State ----------------------------

  const [form, setForm] = useState<newSnippetForm>({
    user: null,
    title: "",
    description: "",
    language: null,
    language_name: null,
    technology: [],
    technology_names: [],
    code: `


`,
  });

  // All data -------------------------

  const data = {
    form,
    setForm,
  };

  // JSX -------------------------------

  return (
    <MonacoContext.Provider value={data}>{children}</MonacoContext.Provider>
  );
};
