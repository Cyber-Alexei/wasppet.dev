import Button from "@mui/material/Button";
import { changePassword } from "@/interfaces/general_use_interfaces";
import { wasppetButtonMUISx } from "@/styles/sx_MUI_styles/wasppet_button";
import { useMainContext } from "@/hooks/main_context";


export const ChangePassword = ({
  darkModeEnabled,
  formData,
  onInputChange,
  riseMessage,
  onDataSubmit,
}: {
  darkModeEnabled: boolean;
  formData: changePassword;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  riseMessage: string;
  onDataSubmit: () => Promise<void>;
}): JSX.Element => {

  // Context --------------------------------

  const { styles } = useMainContext()

  // JSX -------------------------------------

  return (
    <div
      className={`flex flex-col px-4 py-2 gap-2 ${
        darkModeEnabled ? "bg-primary-background" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-col">
        <label htmlFor="current_password" className={styles.label}>
          Current password
        </label>
        <input
          id="current_password"
          name="current_password"
          className={styles.inputs}
          type="password"
          value={formData.current_password}
          onChange={onInputChange}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="new_password" className={styles.label}>
          New password
        </label>
        <input
          id="new_password"
          name="new_password"
          className={styles.inputs}
          type="password"
          value={formData.new_password}
          onChange={onInputChange}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="new_password_confirm" className={styles.label}>
          Confirm new password
        </label>
        <input
          id="new_password_confirm"
          name="new_password_confirm"
          className={styles.inputs}
          type="password"
          value={formData.new_password_confirm}
          onChange={onInputChange}
        />
      </div>
      <div>
        <Button
            variant="contained"
            onClick={onDataSubmit}
            sx={wasppetButtonMUISx}
        >
            Update password
        </Button>
      </div>
      {riseMessage.length > 0 && <div className={`py-2 ${darkModeEnabled ? 'text-primary-font-color' : ''}`}>{riseMessage}</div>}
    </div>
  );
};
