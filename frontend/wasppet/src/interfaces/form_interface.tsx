// Form

// Interfaces are imported in the file where the component is requested,
// then all the data is provided using the interface, to the component
// in a prop named "data".
// The component take the data and automatically create the element.
// The component for this interface is in:'@/components/form/form';

// Interface for the "fields" property of FormInterface
interface Fields {
  field: string;
  type: string;
  state: any;
  required?: boolean;
  placeholder?: string;
  div_styles?: string;
  input_styles?: string;
}

// Interface to request the creation of a form
export interface FormInterface {
  fields: Fields[];
  form_classes?: string;
  main_div_classes?: string;
  div_for_input_classes?: string;
  input_classes?: string;
  button_text: string;
  button_classes?: object;
  button_variant?: "text" | "outlined" | "contained";
  change_handler: React.ChangeEventHandler<HTMLInputElement>;
  submit_handler: React.FormEventHandler<HTMLFormElement>;
}

/*
Example of use:

const formData: FormInterface = {
  fields: [
    {
      field: "username",
      placeholder: "Username",
      type: "text",
      state: formState.username,
      required: true,
    },
    {
      field: "email",
      placeholder: "Email address",
      type: "email",
      state: formState.email,
      required: true,
    },
    {
      field: "password",
      placeholder: "Password",
      type: "password",
      state: formState.password,
      required: true,
    },
    {
      field: "confirm-password",
      placeholder: "Confirm password",
      type: "password",
      state: formState.confirm_password,
      required: true,
    },
  ],
  change_handler: handleInputChange,
  submit_handler: handleSubmit,
  button_text: "send",
  button_variant: "contained",
  button_classes: "bg-black",
  input_classes:
    "h-[25px] rounded-[3px] border border-solid border-custom-light-gray h-8 p-2 outline-none",
  div_for_input_classes: "flex flex-col",
  main_div_classes: "flex flex-col gap-[30px] py-[40px]",
  form_classes: "flex flex-col w-[60%]",
};
*/