"use client";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { FormInterface } from "@/interfaces/form_interface";
import { Form } from "@/components/form/form";
import Link from "next/link";
import { userLogin } from "@/controllers/login";
import { login_FormData } from "@/interfaces/general_use_interfaces";
import { ForgotPasswordModal } from "@/components/modal/forgot_password";

const Login: NextPage = () => {
  // Router --------------------------

  const router = useRouter();

  // States --------------------------

  const [formState, setFormState] = useState<login_FormData>({
    email: "",
    password: "",
  });

  const [errorWhenAuth, setErrorWhenAuth] = useState<string | null>();
  const [recoverPassword, setRecoverPassword] = useState<boolean>(false);

  // On change ---------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  // On submit ---------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const controllerResponse = await userLogin(formState);
    // Backend view also return "newly_created", a boolean string value
    // that indicates if the token is newly created or has been recovered
    if (controllerResponse.success === true) {
      setErrorWhenAuth(null);
      // Store the token in localStorage
      localStorage.setItem(
        "wasppet.dev_user-token",
        controllerResponse.detail.token,
      );
      // Redirect the user to Home
      router.replace("/home");
    } else {
      setErrorWhenAuth(controllerResponse.detail.Detail);
    }
  };

  // Form builder ------------------------

  const formData: FormInterface = {
    fields: [
      {
        field: "email",
        placeholder: "Email address",
        type: "email",
        state: formState.email,
      },
      {
        field: "password",
        placeholder: "Password",
        type: "password",
        state: formState.password,
      },
    ],
    change_handler: handleInputChange,
    submit_handler: handleSubmit,
    button_text: "send",
    button_variant: "contained",
    button_classes: {
      backgroundColor: "var(--primary-background)",
    },
    input_classes:
      "h-[25px] custom-placeholder-font-size rounded-[3px] border border-solid border-custom-light-gray h-8 p-2 outline-none",
    div_for_input_classes: "flex flex-col",
    main_div_classes: "flex flex-col gap-[30px] py-[40px]",
    form_classes: "flex flex-col w-[80%] min-w-[150px] p-3",
  };

  // Effect -----------------------------------------

  // Find the last user session token and delete it
  useEffect(() => {}, []);

  // JSX ------------------------------------------------------------

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-primary-background px-3">
      <div className="rounded-2xl my-3 w-[800px] min-w-[150px] flex flex-row flex-wrap bg-white min-h-[80vh]">
        <div className="pt-10 px-3 min-w-[270px] rounded-xl flex-1 bg-[url('/images/wasp2.jpg')] bg-cover bg-center">
          {/* Image div*/}
          <h2 className="text-subtitle text-white font-bold min-w-[150px]">
            Log-in The Hive!
          </h2>
          <p className="text-white text-base font-semibold overline pt-1">
            Enter your data.
          </p>
        </div>
        <div className="flex flex-1 min-w-[270px] flex-col justify-center items-center py-3">
          <h1 className="text-subtitle font-semibold">Log-In</h1>
          <Form data={formData} />
          {errorWhenAuth && <p className="text-center px-4">{errorWhenAuth}</p>}
          <p className="pt-2 text-[14px] text-center max-w-[300px] min-w-[150px]">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <span className="underline">Sign-up</span>
            </Link>
          </p>
          <p
            className="cursor-pointer text-[14px]"
            onClick={() => setRecoverPassword(true)}
          >
            I forgot my password
          </p>
        </div>
      </div>
      {recoverPassword && (
        <ForgotPasswordModal setRecoverPassword={setRecoverPassword} />
      )}
    </div>
  );
};

export default Login;
