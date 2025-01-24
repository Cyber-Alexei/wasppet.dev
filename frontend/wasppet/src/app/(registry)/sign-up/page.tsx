"use client";
import "@/styles/globals.css";
import { NextPage } from "next";
import { useState } from "react";
import { FormInterface } from "@/interfaces/form_interface";
import { Form } from "@/components/form/form";
import Link from "next/link";
import { userRegistration } from "@/controllers/registration";
import { VAR } from "@/utils/variables";
import Button from "@mui/material/Button";
import { signup_FormData, signup_objectControllerResponse } from '@/interfaces/general_use_interfaces';
import { passwordLength, passwordSecurity } from "@/utils/functions/password";

const Signup: NextPage = () => {
  
  // State for display if the password doesn't match

  const [passwordDontMatch, setPasswordDontMatch] = useState<boolean>(false);
  const [passwordInsecure, setPasswordInsecure] = useState<boolean>(false);
  const [shortPassword, setShortPassword] = useState<boolean>(false);
  const [controllerResult, setControllerResult] =
    useState<signup_objectControllerResponse | null>(null);

  // Form state ------------------

  const [formState, setFormState] = useState<signup_FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // On change ---------------------------

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.endsWith(' ')) return;
    if (['password', 'confirmPassword'].includes(e.target.name)) {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
      });
    } else {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value.toLowerCase(),
      });
    }
  };

  // On submit ---------------------------

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) {
      setPasswordInsecure(false);
      setShortPassword(false);
      setPasswordDontMatch(true);
    } else if (!passwordLength(formState.password)) {
      setPasswordInsecure(false);
      setPasswordDontMatch(false);
      setShortPassword(true);
    } else if (!passwordSecurity(formState.password)) {
      setPasswordDontMatch(false);
      setShortPassword(false);
      setPasswordInsecure(true);
    } else {
      const { confirmPassword, ...data } = formState;
      const result = await userRegistration(data);
      setControllerResult(result);

      setPasswordDontMatch(false);
      setPasswordInsecure(false);
      setShortPassword(false);
    }
  };

  // Form builder ------------------------

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
        field: "confirmPassword",
        placeholder: "Confirm password",
        type: "password",
        state: formState.confirmPassword,
        required: true,
      },
    ],
    change_handler: handleInputChange,
    submit_handler: handleSubmit,
    button_text: "send",
    button_variant: "contained",
    button_classes: {
      backgroundColor: 'var(--primary-background)',
    },
    input_classes:
      "h-[25px] custom-placeholder-font-size rounded-[3px] border border-solid border-custom-light-gray h-8 p-2 outline-none",
    div_for_input_classes: "flex flex-col",
    main_div_classes: "flex flex-col gap-[30px] py-[40px]",
    form_classes: "flex flex-col w-[80%] min-w-[150px] p-3",
  };

  // View --------------------------------

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-primary-background px-3">
      <div className="rounded-2xl my-3 w-[800px] min-w-[150px] flex flex-row flex-wrap bg-white min-h-[80vh]">
        <div className="pt-10 px-3 min-w-[270px] rounded-xl flex-1 bg-[url('/images/wasp1.jpg')] bg-cover bg-center">
          {/* Image div*/}
          <h2 className="text-subtitle text-white font-bold min-w-[150px]">
            Join The Hive!
          </h2>
          <p className="text-white text-base font-semibold overline pt-1">
            Complete your data to start.
          </p>
        </div>
        <div className="flex flex-1 min-w-[270px] flex-col justify-center items-center py-3">
          {controllerResult === null && (
            <div className="flex min-w-[270px] w-full flex-col justify-center items-center">
              <h1 className="text-subtitle font-semibold">Sign-Up</h1>
              <Form data={formData} />
            </div>
          )}
          {passwordDontMatch && (
            <p className="pt-1">Your password doesn't match</p>
          )}
          {controllerResult && (
            <p className="pt-1 w-[286px] text-black text-center">
              {controllerResult.success === true ? (
                "We sent a confirmation email, go to your inbox!"
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-primary-color">
                    {controllerResult.detail.message ||
                      "There was an unexpected error, please contact us "}
                  </span>
                  <Button
                    variant="contained"
                    sx={{
                      width: "100%",
                      backgroundColor: "#ffbf00",
                      fontWeight: "600",
                      mt: 2,
                    }}
                    href={`mailto:${VAR.CONTACT_EMAIL}?subject=Registration%20error&body=Please%20send%20this%20message`}
                  >
                    Send email
                  </Button>
                </div>
              )}
            </p>
          )}
          {passwordInsecure && (
            <p className="pt-1">
              Add at least one capital letter and one number
            </p>
          )}
          {shortPassword && (
            <p className="pt-1">
              Your password must contain at least 9 characters
            </p>
          )}
          {controllerResult === null && (
            <p className="pt-2 text-[14px] text-center max-w-[300px] min-w-[150px]">
              Already have an account?{" "}
              <Link href="/log-in">
                <span className="underline">log-in</span>
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;