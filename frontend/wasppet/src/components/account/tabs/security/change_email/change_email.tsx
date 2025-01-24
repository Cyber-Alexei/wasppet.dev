import Button from "@mui/material/Button";
import { wasppetButtonMUISx } from "@/styles/sx_MUI_styles/wasppet_button";
import { useMainContext } from "@/hooks/main_context";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useState } from "react";
import { sendVerificationCode, updateUserData } from "@/controllers/account";
import { changeEmailInputs } from "@/interfaces/general_use_interfaces";
import { randomCodeGenerator } from "@/utils/functions/generation";
import { useRouter } from "next/navigation";


export const ChangeEmail = (): JSX.Element => {
  // Router ---------------------------------------------------------------------

  const router = useRouter();

  // Context ---------------------------------------------------------------------

  const { darkModeEnabled, styles } = useMainContext();
  const { userAuth, setUserAuth } = useUserAuthContext();

  // State -----------------------------------------------------------------------

  const [emailWasSent, setEmailWasSent] = useState<boolean>(false);
  const [opportunitiesCounter, setOpportunitiesCounter] = useState<number>(3);
  const [emailChangedSuccessfully, setEmailChangedSuccessfully] = useState<boolean>(false);

  
  const [inputValues, setInputValues] = useState<changeEmailInputs>({
    newEmail: '',
    code: null,
    userVerificationCode: '',
    userPassword: '',
  })

  const [controllerError, setControllerError] = useState<any>(null)

  // Counter restriction for opportunities to enter the verification code ---------

  if (opportunitiesCounter < 0) {
    localStorage.removeItem("wasppet.dev_user-token");
    setTimeout(() => {
      router.push("/");
    }, 6000);
  }

  // Handle event inputs ------------------------------------------------------

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value

    });
    // If there is a change in new email input 
    // then enable the possibility of restart the process
    if (e.target.name !== 'userVerificationCode') setEmailWasSent(false);
  };

  // Handle event --------------------------------------------------------------

  const onFormSend = async () => {
    // Verify form
    if (inputValues.newEmail === "" || userAuth?.email === inputValues.newEmail) {
      return;
    }
    // Generate a random code of a 4 digit number
    const randomCode = randomCodeGenerator();
    // Set the code in the state as a string
    setInputValues({
      ...inputValues,
      code: randomCode,
    });

    // Ensure there is a user in the context (needed to take the email)
    if (!userAuth) return; 

    // Prepare the data to be sent in the controller
    const data = {
      randomCode: randomCode,
      new_email: inputValues.newEmail,
      current_email: userAuth?.email,
      password: inputValues.userPassword,
    }

    console.log(data)
    // POST Request to send the code and email to the backend using a controller
    // Backend view will receive the data, generate and send an email
    const controllerResult = await sendVerificationCode(data);
    console.log(controllerResult)

    // Email sent, show the input to enter the validation code
    if (controllerResult.success === true) {
      setEmailWasSent(true);
    }
  };

  const onCodeVerification = async () => {
    setOpportunitiesCounter((opportunitiesCounter) => opportunitiesCounter - 1);

    if (opportunitiesCounter < 0) return;

    if (inputValues.code === inputValues.userVerificationCode && userAuth) {
      // Take the instance of the user and quit the field 'avatar' (image)
      const { avatar, ...data } = userAuth;
      // Set the user updated data to send to the backend
      const dataToSend = {
        ...data,
        email: inputValues.newEmail,
      };
      // Send and update the user email in the backend with a controller
      // POST Request to update the current authenticated model user instance
      const controllerResult = await updateUserData(dataToSend);
      if (controllerResult.success === true) {
        if (controllerResult.detail.id) {
          setUserAuth(controllerResult.detail);
          setEmailWasSent(false);
          setEmailChangedSuccessfully(true);
          setInputValues({
            newEmail: '',
            code: null,
            userVerificationCode: '',
            userPassword: '',
          })
        }
      } else {
        setControllerError(controllerResult.detail.Detail)
      }
    }
  };

  // JSX --------------------------------------------------------------------

  return (
    <div
      className={`flex flex-col px-4 py-2 gap-2 ${
        darkModeEnabled ? "bg-primary-background" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-col pb-[5px] h-[60px]">
        <p className={styles.label}>Current email:</p>
        <p 
        className={`break-all ${darkModeEnabled ? "text-white" : ""}`}
        >
          {userAuth?.email}
        </p>
      </div>
      <div className="flex flex-col">
        <label htmlFor="newEmail" className={styles.label}>
          New email
        </label>
        <input
          id="newEmail"
          name="newEmail"
          className={styles.inputs}
          type="email"
          value={inputValues.newEmail}
          onChange={onInputChange}
        />
      </div>
      {!emailWasSent && (
        <div className="flex flex-col">
          <label
          htmlFor="userPassword"
          className={styles.label}
          >
            Current password
          </label>
          <input
            id="userPassword"
            name="userPassword"
            type="password"
            className={styles.inputs}
            value={inputValues.userPassword}
            onChange={onInputChange}
          />
        </div>
      )}
      {emailWasSent && (
        <div className="flex flex-col items-center flex-wrap gap-2">
          <label
            htmlFor="userVerificationCode"
            className={styles.label}
          >
            {`Enter the code that was sent to ${inputValues.newEmail}:`}
          </label>
          <input
            id="userVerificationCode"
            name="userVerificationCode"
            className={`${styles.inputs} w-[150px]`}
            value={inputValues.userVerificationCode}
            onChange={onInputChange}
            placeholder="XXXX"
          />
          <Button
            variant="contained"
            sx={wasppetButtonMUISx}
            onClick={onCodeVerification}
          >
            Change email
          </Button>
          {opportunitiesCounter >= 0 && (
            <p>{`You have ${opportunitiesCounter + 1} opportunities`}</p>
          )}
          {opportunitiesCounter < 0 && (
            <p className="font-semibold">
              The session was closed for security reasons, login again.
            </p>
          )}
          {controllerError && (
            <p>{controllerError}</p>
          )}
        </div>
      )}
      {emailChangedSuccessfully && <p>Your email was changed successfully!</p>}
      <div>
        {!emailWasSent && (
          <Button
            variant="contained"
            onClick={onFormSend}
            sx={wasppetButtonMUISx}
          >
            Send code
          </Button>
        )}
      </div>
    </div>
  );
};
