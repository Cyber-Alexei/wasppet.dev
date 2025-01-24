import { useMainContext } from "@/hooks/main_context";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Button from "@mui/material/Button";

export const GeneralModal = () => {
  // Context ------------------

  const { darkModeEnabled, styles, generalModal, setGeneralModal } =
    useMainContext();

  return (
    <div
      className={`absolute z-20 flex flex-col items-center 
    justify-center h-[100vh] w-[100vw] bg-shading-50 overflow-hidden`}
    >
      <div
        className={`flex flex-col gap-4 items-center justify-center w-[90%] h-[70%] sm:w-[70%] sm:h-[70%] md:w-[60%] md:h-[60%] lg:w-[50%] lg:h-[50%] ${
          darkModeEnabled ? "bg-fourth-background" : "bg-secondary-background"
        }`}
      >
        {generalModal && generalModal.type === "error" && (
          <ErrorOutlineIcon
            sx={{
              fontSize: "120px",
              color: `${
                darkModeEnabled
                  ? "var(--primary-font-color)"
                  : "var(--custom-light-gray-2)"
              }`,
            }}
          />
        )}
        {generalModal && generalModal.type === "success" && (
          <CheckCircleOutlineIcon
            sx={{
              fontSize: "120px",
              color: `${
                darkModeEnabled
                  ? "var(--primary-font-color)"
                  : "var(--custom-light-gray-2)"
              }`,
            }}
          />
        )}
        <p
          className={`${
            darkModeEnabled
              ? "text-primary-font-color"
              : "text-primary-background"
          }`}
        >
          {generalModal?.message}
        </p>
        <Button
          variant="contained"
          sx={styles.wasppetButtonMUISx_2}
          onClick={() => setGeneralModal(null)}
        >
          Close
        </Button>
      </div>
    </div>
  );
};
