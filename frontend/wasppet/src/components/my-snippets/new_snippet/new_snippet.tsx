import { MonacoEditorInstanceNewSnippet } from "@/components/monaco_editor/monaco_new_snippet";
import Button from "@mui/material/Button";
import { useMainContext } from "@/hooks/main_context";
import { useMonacoContext } from "@/hooks/monaco_context";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { MonacoInterface } from "@/interfaces/monaco_interface";
import { useEffect, useState } from "react";
import { getAllSkills } from "@/controllers/monacoEditor";
import { newSnippetForm } from "@/interfaces/general_use_interfaces";
import { createNewSnippet, updateSnippet } from "@/controllers/snippet";
import Select from 'react-select';


// Component ------------------------------------------

export const NewSnippet = (): JSX.Element => {

  // Context ------------------------------------

  const { styles, darkModeEnabled } = useMainContext();
  const { form, setForm } = useMonacoContext();
  const { userAuth, setReloadUserAuthData } = useUserAuthContext();

  // State -------------------------------------

  const [editorKey, setEditorKey] = useState<number>(1);
  const [skills, setSkills] = useState<any | null>(null);
  const [message, setMessage] = useState<string|null>(null);

  // Editor configuration ----------------------

  const monacoEditorInstanceData: MonacoInterface = {
    defaultLanguage: form.language?.value || null,
    value: form.code,
  };

  // Handle event -------------------------------

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTechSelect = (selected: any) => {
    setForm({
      ...form,
      technology: selected
    });
  };

  const handleChangeLangueageSelect = (selected: any) => {
    setForm({
      ...form,
      language: selected,
    });
  };

  const onEditorChange = (e: string) => {
    setForm({
      ...form,
      code: e,
    });
  };

  const onSnippetSave = async () => {
    // Prepare data to send to the controller
    if (!userAuth || typeof form.language !== "object") return;
    const dataToSend:newSnippetForm = {
      id: form.id || null,
      title: form.title,
      description: form.description,
      user: userAuth?.id,
      code: form.code,
      language: form.language || null,
      language_name: form.language || null,
      technology: form.technology,
      technology_names: form.technology,
    }

    let controllerResponse;

    if (form.id) {
      // Updated
      controllerResponse = await updateSnippet(dataToSend)
    } else {
      controllerResponse = await createNewSnippet(dataToSend);
    }

    if (controllerResponse.success === true) {
      setMessage('Your snippet has been saved');
      setTimeout(() => {
        setMessage(null);
      }, 3000)
      setReloadUserAuthData(prevState => prevState + 1)
      setForm({
        user: null,
        title: "",
        description: "",
        language: null,
        language_name: null,
        technology: [],
        technology_names: [],
        code: `


`,
      })
    } else {
      setMessage('An error occurred')
    }
  };

  // Function ----------------------------------

    // Prepare the options for the technologies select from skills state
    const techOptions = skills?.filter((skill: any) => (skill.category === "T"))
    .map((skill: any) => ({value: skill.name, label: skill.name }))

    // Prepare the option for the language select from skills state
    const languagesOptions = skills?.filter((skill: any) => (skill.category === "L"))
    .map((skill: any) => ({value: skill.name, label: skill.name}))

  // useEffect ----------------------------------

  useEffect(() => {
    (async () => {
      const response = await getAllSkills();
      if (response) {
        setSkills(response.detail);
      }
    })();
  }, [])

  // JSX ----------------------------------------

  return (
    <div className="flex flex-wrap justify-between items-center w-auto gap-10 pb-8">
      <div
        id="form"
        className={`flex justify-between mx-auto flex-col w-full sm:w-[80%] md:w-[80%] lg:w-[30%] lg:min-w-[310px] pt-4 pb-4 pl-4 pr-4 rounded-sm ${
          darkModeEnabled
            ? "border-black"
            : "bg-primary-color border-custom-light-gray"
        }`}
      >
        <div id="title_div" className={styles.row_div_2}>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onInputChange}
            className={styles.inputs_new_snippet}
            placeholder="Title"
          />
        </div>
        <div id="description_div" className={styles.row_div_2}>
          
          <input
            id="description"
            name="description"
            value={form.description}
            onChange={onInputChange}
            className={styles.inputs_new_snippet}
            placeholder="Short description"
          />
        </div>
        <div id="language_div" className={styles.row_div_2}>
          
          {/*INPUT SELECT*/}
          <Select
            id="language"
            name="language"
            options={languagesOptions}
            value={form.language}
            onChange={handleChangeLangueageSelect}
            onBlur={() => setEditorKey(editorKey + 1)}
            placeholder="Write and select a language"
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: '168px',
                overflow: 'hidden',
                marginTop: '15px',
              }),
              control: (provided) => ({
                ...provided,
                border: 'none',
              }),
              placeholder: (provided) => ({
                ...provided,
                color: 'var(--custom-light-gray-3)'
              }),
            }}
          />
          {/* -- */}
        </div>
        <div id="technology_div" className={styles.row_div_2}>
          
          {/*INPUT SELECT*/}
          <Select
            id="technologies"
            name="technologies"
            options={techOptions}
            isMulti
            value={form.technology}
            onChange={handleChangeTechSelect}
            placeholder="Write and select technologies"
            styles={{
              menu: (provided) => ({
                ...provided,
                maxHeight: '105px',
                overflow: 'hidden',
              }),
              control: (provided) => ({
                ...provided,
                border: 'none',
              }),
              placeholder: (provided) => ({
                ...provided,
                color: 'var(--custom-light-gray-3)'
              }),
            }}
          />
          {/* -- */}
        </div>
        <div className="flex h-[30px] text-center items-center justify-center">
          {message && (
            <p className={`pt-2 text-center ${darkModeEnabled ? 'text-primary-font-color' : ''}`}>{message}</p>
          )}
        </div>
        <div className="pt-4 pb-2">
          <Button
            variant="contained"
            sx={styles.wasppetButtonMUISx_2}
            className="w-full"
            onClick={onSnippetSave}
          >
            Save
          </Button>
        </div>
      </div>
      <div
        id="editor_div"
        className="flex flex-1 min-w-[400px] h-[400px] p-[1px] bg-primary-color mx-auto"
      >
        <div className="w-full">
        <MonacoEditorInstanceNewSnippet
          key={editorKey}
          data={monacoEditorInstanceData}
          onEditorChange={onEditorChange}
        />
        </div>
      </div>
    </div>
  );
};
