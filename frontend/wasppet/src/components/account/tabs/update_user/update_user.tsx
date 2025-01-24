import Button from "@mui/material/Button";
import { useMainContext } from "@/hooks/main_context";
import { userAuthInterface } from "@/interfaces/general_use_interfaces";
import { wasppetButtonMUISx } from "@/styles/sx_MUI_styles/wasppet_button";
import { SetStateAction } from "react";
import { updateUserData } from "@/controllers/account";

export const UpdateUser = ({
  user,
  setUserAuth,
}: {
  user: userAuthInterface;
  setUserAuth:
    | ((stateAction: SetStateAction<userAuthInterface | null>) => void)
    | undefined;
}): JSX.Element => {
  // Context ----------------------------

  const { darkModeEnabled, styles } = useMainContext();

  // Event handler (only work for the authenticated user) --------------

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setUserAuth) return;
    setUserAuth({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!setUserAuth) return;
    setUserAuth({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSaveDataClick = async () => {
    // Store the new user data in the DB with a controller
    const { avatar, ...data } = user;
    const controllerResult = await updateUserData(data);
    console.log(data, "DATA");
    console.log(controllerResult, "ControllerResult");

    if (controllerResult.success === true && setUserAuth) {
      // Store the new user data in the Main context
      setUserAuth({
        ...user,
        complete_name: user.first_name + " " + user.last_name,
      });
    }
  };

  // JSX --------------------------------

  return (
    <form
      className={`flex flex-col px-4 gap-2 pb-2 ${darkModeEnabled ? "bg-primary-background" : "bg-gray-100"}`}
    >
      <div className={styles.row_div}>
        <div className={styles.input_div_2_items}>
          <label className={styles.label}>Birthday</label>
          <input
            type="date"
            name="birthday_date"
            className={styles.inputs}
            value={user?.birthday_date || ""}
            onChange={onInputChange}
          />
        </div>
        <div className={styles.input_div_2_items}>
          <label className={styles.label}>Job position</label>
          <input
            type="text"
            maxLength={100}
            name="job_position"
            className={styles.inputs}
            value={user?.job_position || ""}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className={styles.row_div}>
        <div className={styles.input_div_2_items}>
          <label className={styles.label}>First name</label>
          <input
            type="text"
            maxLength={50}
            name="first_name"
            className={styles.inputs}
            value={user?.first_name || ""}
            onChange={onInputChange}
          />
        </div>
        <div className={styles.input_div_2_items}>
          <label className={styles.label}>Last name</label>
          <input
            type="text"
            maxLength={50}
            name="last_name"
            className={styles.inputs}
            value={user?.last_name || ""}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className={styles.row_div}>
        <div className={styles.input_div_2_items}>
          <label className={styles.label}>
            Skills - separated with a comma (e.g: CSS, HTML, Python)
          </label>
          <textarea
            className={styles.inputs}
            name="skills"
            maxLength={1000}
            value={user?.skills}
            onChange={onTextAreaChange}
          />
        </div>
        <div className={styles.input_div_2_items}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.inputs}
            name="description"
            maxLength={500}
            value={user?.description || ""}
            onChange={onTextAreaChange}
          />
        </div>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={onSaveDataClick}
          sx={wasppetButtonMUISx}
        >
          Update my user data
        </Button>
      </div>
    </form>
  );
};
