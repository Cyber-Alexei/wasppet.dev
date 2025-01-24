import Button from "@mui/material/Button";
import { deleteUser } from "@/controllers/user";
import { useUserAuthContext } from "@/hooks/user_auth_context";

export const DeleteAccount = ({
  darkModeEnabled,
}: {
  darkModeEnabled: boolean;
}): JSX.Element => {
  // Context ----------------

  const { userAuth } = useUserAuthContext();

  // Handle events ----------

  const onDeleteAccount = async () => {
    if (!userAuth) return;
    const controllerResponse = await deleteUser(userAuth.id);
    console.log(controllerResponse, "CR")
    if (controllerResponse.success === true) {
      window.localStorage.removeItem("wasppet.dev_user-token");
      window.location.href = "/";
    }
  };

  // JSX --------------------

  return (
    <div
      className={`flex flex-col p-4 gap-4 ${
        darkModeEnabled
          ? "text-primary-font-color"
          : "bg-gray-100 text-primary-background"
      }`}
    >
      <div>
        Are you sure, you want to delete your account?
        {<br></br>}
        All your data will be deleted.
      </div>
      <div>
        <Button
          variant="contained"
          sx={{
            boxShadow: "none",
            fontWeight: "600",
            border: "none",
            padding: "2px 10px",
            backgroundColor: "var(--primary-color)",
            fontFamily: "'opensans', sans-serif",
            color: "var(--primary-font-color)",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "var(--alert-color)",
            },
          }}
          onClick={onDeleteAccount}
        >
          Delete my account
        </Button>
      </div>
    </div>
  );
};
