import Button from "@mui/material/Button";
import { useMainContext } from "@/hooks/main_context";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useState } from "react";
import { changePassword } from "@/interfaces/general_use_interfaces";
import { ChangePassword } from "@/components/account/tabs/security/change_password/change_password";
import { changePasswordController } from "@/controllers/account";
import { passwordLength, passwordSecurity } from "@/utils/functions/password";
import { wasppetButtonMUISx } from "@/styles/sx_MUI_styles/wasppet_button";
import { ChangeEmail } from "@/components/account/tabs/security/change_email/change_email";
import { DeleteAccount } from "@/components/account/tabs/security/delete_account/delete_account";


export const Security = (): JSX.Element => {
  // Comtext -------------------------------

  const { darkModeEnabled } = useMainContext();
  const { userAuth } = useUserAuthContext();

  // State ---------------------------------

  const [riseMessage, setRiseMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("");

  const [formData, setFormData] = useState<changePassword>({
    current_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  // Handle event --------------------------

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onDataSubmit = async () => {
    // Form validation

    if (formData.new_password !== formData.new_password_confirm) {
      setRiseMessage("Confirm your new password correctly");
      return;
    }

    if (!passwordLength(formData.new_password)) {
      setRiseMessage("Your new password must be at least 9 characters long");
      return;
    }

    if (!passwordSecurity(formData.new_password)) {
      setRiseMessage(
        "Your new password must contain at least one number and one capital letter"
      );
      return;
    }

    // Send data to backend with a controller

    const dataToSend = {
      current_password: formData.current_password,
      new_password: formData.new_password,
      id: userAuth?.id,
    };

    const controllerResult = await changePasswordController(dataToSend);

    // Set the backend message in State
    if (controllerResult.detail.Detail) {
      setRiseMessage(controllerResult.detail.Detail);
    }

    // Clean the form
    if (controllerResult.success === true) {
      setFormData({
        current_password: "",
        new_password: "",
        new_password_confirm: "",
      });
    }
  };

  // JSX ------------------------------------

  return (
    <div>
      <div className="flex gap-6 px-4 pb-[8px]">
        <Button 
        variant="contained" 
        sx={wasppetButtonMUISx}
        onClick={() => {
          if (activeTab === 'changePassword') {
            setActiveTab('')
          } else {
            setActiveTab('changePassword')
          }
        }}
        >
          Change password
        </Button>
        <Button 
        variant="contained" 
        sx={wasppetButtonMUISx}
        onClick={() => {
          if (activeTab === 'changeEmail') {
            setActiveTab('')
          } else {
            setActiveTab('changeEmail')
          }
        }}
        >
          Change email
        </Button>
        <Button 
        variant="contained" 
        sx={wasppetButtonMUISx}
        onClick={() => {
          if (activeTab === 'deleteAccount') {
            setActiveTab('')
          } else {
            setActiveTab('deleteAccount')
          }
        }}
        >
          Delete account
        </Button>
      </div>
      <div>
        {activeTab === "changePassword" && (
          <ChangePassword
            darkModeEnabled={darkModeEnabled}
            formData={formData}
            onInputChange={onInputChange}
            riseMessage={riseMessage}
            onDataSubmit={onDataSubmit}
          />
        )}
        {activeTab === "changeEmail" && (
            <ChangeEmail />
        )}
        {activeTab === "deleteAccount" && (
            <DeleteAccount darkModeEnabled={darkModeEnabled}/>
        )}
      </div>
    </div>
  );
};
