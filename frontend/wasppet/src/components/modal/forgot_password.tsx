import Button from "@mui/material/Button";
import { wasppetButtonMUISx } from "@/styles/sx_MUI_styles/wasppet_button";
import { SetStateAction, useState } from "react";
import { forgotPasswordInputs } from "@/interfaces/general_use_interfaces";
import { useMainContext } from "@/hooks/main_context";
import { randomCodeGenerator } from "@/utils/functions/generation";
import { forgotPasswordVerificationCode } from "@/controllers/account";
import { recoverPassword } from "@/controllers/account";
import CancelIcon from "@mui/icons-material/Cancel";
import { passwordLength, passwordSecurity } from "@/utils/functions/password";

export const ForgotPasswordModal = ({
  setRecoverPassword,
}: {
  setRecoverPassword: (stateaction: SetStateAction<boolean>) => void;
}): JSX.Element => {
  // Context --------------------------------------------------------------

  const { styles } = useMainContext();

  // State -----------------------------------------------------------------

  const [inputValues, setInputValues] = useState<forgotPasswordInputs>({
    emailInput: "",
    code: "",
    userVerificationCode: "",
    new_password: "",
    new_password_confirm: "",
  });

  const [stages, setStages] = useState<string>("1");
  const [errorMessages, setErrorMessages] = useState<string | null>(null);
  const [opportunitiesCounter, setOpportunitiesCounter] = useState<number>(3);
  const [processFinalized, setProcessFinalized] = useState<boolean>(false);

  // Event handler ---------------------------------------------

  const onChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
  };

  const onSendEmail = async () => {
    if (inputValues.emailInput === "") return;
    // Generate a random code of a 4 digit number
    const randomCode = randomCodeGenerator();
    // Set the generated code in the state
    setInputValues({
      ...inputValues,
      code: randomCode,
    });
    // Prepare the data to send to the backend using a controller

    const data = {
      randomCode: randomCode,
      email: inputValues.emailInput,
    };
    // Send the data
    const controllerResponse = await forgotPasswordVerificationCode(data);

    if (controllerResponse.success === true) {
      setErrorMessages(null);
      setStages("2");
    } else {
      setErrorMessages(controllerResponse.detail.Detail);
    }
  };

  const onCodeVerification = async () => {
    setOpportunitiesCounter((opportunitiesCounter) => opportunitiesCounter - 1);
    if (opportunitiesCounter < 0) return;
    if (inputValues.userVerificationCode === inputValues.code) {
      setErrorMessages(null);
      setStages("3");
    }
  };

  const onSetNewPassword = async () => {
    if (inputValues.new_password !== inputValues.new_password_confirm) {
      setErrorMessages("Your password confirmation doesn't match");
      return;
    }
    // Validate the new password. Must include at least one upper and one number
    if (!passwordSecurity(inputValues.new_password)) {
        setErrorMessages("Set at least one capital letter and one number");
        return;
    }

    if (!passwordLength(inputValues.new_password)) {
        setErrorMessages("Set at least 9 characters");
        return;
    }

    // Prepare data to send to retrieve the password
    const data = {
      user_email: inputValues.emailInput,
      new_password: inputValues.new_password,
    };
    // Send the new password to a backend view to be updated in DB
    const controllerResult = await recoverPassword(data);
    console.log(controllerResult)
    if (controllerResult.success === true) {
      setErrorMessages(null);
      setProcessFinalized(true);
    } else {
      setErrorMessages(controllerResult.detail.Detail);
    }
  };

  const onTryAgainButtonClick = () => {

    setStages("1");
    setErrorMessages(null);
    setOpportunitiesCounter(3);
    setInputValues({
      ...inputValues,
      emailInput: "",
      code: "",
      userVerificationCode: "",
    });
  };

  // JSX -------------------------------------------------------

  return (
    <div className="absolute z-20 p-10 flex flex-col items-center justify-center lg:w-[80%] w-[100%] lg:h-[80%] h-[100%] bg-fourth-background rounded-md">
      {/*Icon*/}
      <CancelIcon
        sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: 30,
            transition: 'transform 0.6s ease',
            '&:hover': {
                transform: 'scale(1.2)',
            }
        }}
        onClick={() => setRecoverPassword(false)}
      ></CancelIcon>
      {/*Icon*/}
      {processFinalized === false && (
        <div className="w-[50%] min-w-[300px]">
        {stages === "1" && (
          <div className="flex flex-col items-center justify-center gap-4 w-[100%] min-w-[300px]">
            <p className="text-primary-font-color font-semibold py-6 text-center">
              Share your email, we will send you a verification code!
            </p>
            <input
              name="emailInput"
              className={`${styles.inputs} w-[100%]`}
              type="text"
              value={inputValues.emailInput}
              onChange={onChangeInputs}
              placeholder="Write your account email"
            />
            <Button
              sx={wasppetButtonMUISx}
              className="w-[100%]"
              variant="contained"
              onClick={onSendEmail}
            >
              Send
            </Button>
            {errorMessages && <p className="text-primary-font-color text-center">{errorMessages}</p>}
          </div>
        )}
        {stages === "2" && (
          <div className="flex flex-col items-center justify-center gap-4 w-[100%] min-w-[300px]">
            <p className="text-primary-font-color font-semibold py-6 text-center">
              Enter the verification code
            </p>
            <input
              name="userVerificationCode"
              className={`${styles.inputs} w-[100%]`}
              type="text"
              value={inputValues.userVerificationCode}
              onChange={onChangeInputs}
              placeholder="XXXX"
            />
            <Button
              sx={wasppetButtonMUISx}
              className="w-[100%]"
              variant="contained"
              onClick={onCodeVerification}
            >
              Verify
            </Button>
            {opportunitiesCounter >= 0 && (
              <p className="text-primary-font-color text-center">{`You have ${opportunitiesCounter + 1} opportunities`}</p>
            )}
            {opportunitiesCounter < 0 && (
              <p className="font-semibold text-primary-font-color text-center">
                Maximum number of attempts, request a new code.
              </p>
            )}
            {opportunitiesCounter < 0 && (
              <Button
                sx={wasppetButtonMUISx}
                className="w-[100%]"
                variant="contained"
                onClick={onTryAgainButtonClick}
              >
                Try again
              </Button>
            )}
            {errorMessages && <p className="text-primary-font-color text-center">{errorMessages}</p>}
          </div>
        )}
        {stages === "3" && (
          <div className="flex flex-col items-center justify-center gap-4 w-[100%] min-w-[300px]">
            <p className="text-primary-font-color font-semibold py-6 text-center">
              Set a new password
            </p>
            <input
              name="new_password"
              className={`${styles.inputs} w-[100%]`}
              type="password"
              value={inputValues.new_password}
              onChange={onChangeInputs}
              placeholder="New password"
            />
            <input
              name="new_password_confirm"
              className={`${styles.inputs} w-[100%]`}
              type="password"
              value={inputValues.new_password_confirm}
              onChange={onChangeInputs}
              placeholder="Confirm new password"
            />
            <Button
              sx={wasppetButtonMUISx}
              className="w-[100%]"
              variant="contained"
              onClick={onSetNewPassword}
            >
              Save new password
            </Button>
            {errorMessages && <p className="text-primary-font-color text-center">{errorMessages}</p>}
          </div>
        )}
      </div>
      )}
      {processFinalized && (
        <p className="text-primary-font-color text-center">Your password has been changed successfully!</p>
      )}
    </div>
  );
};
