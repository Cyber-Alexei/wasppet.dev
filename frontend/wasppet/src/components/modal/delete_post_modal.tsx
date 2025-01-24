import Button from "@mui/material/Button";
import { useMainContext } from "@/hooks/main_context";
import { Dispatch, SetStateAction } from "react";
import { post } from "@/interfaces/general_use_interfaces";

export const DeletePostModal = ({
  onClickToConfirmDelete,
  setShowConfirmation,
  setSelectedPost,
}: {
  onClickToConfirmDelete: () => Promise<void>;
  setShowConfirmation: Dispatch<SetStateAction<boolean>>;
  setSelectedPost: Dispatch<SetStateAction<post | null>>;
}): JSX.Element => {
  // Context ---------------------------------------

  const { darkModeEnabled } = useMainContext();

  // JSX --------------------------------------------

  return (
    <div className="absolute z-100 top-0 left-0 w-full h-full">
      <div className="flex items-center justify-center bg-shading-50 w-full h-full">
        <div
          className={`flex flex-col items-center rounded-sm justify-center w-[99%] min-w-[200px] h-[95%] min-h-[100px] ${
            darkModeEnabled ? "bg-fourth-background" : "bg-secondary-background"
          }`}
        >
          <p
            className={`w-full text-center ${
              darkModeEnabled
                ? "text-primary-font-color"
                : "text-primary-background-color"
            }`}
          >
            Are you sure you want to delete this snippet?
          </p>
          <div className="flex justify-center py-4 gap-4 w-full">
            <Button
              variant="contained"
              onClick={onClickToConfirmDelete}
              sx={{
                backgroundColor: "var(--primary-color)",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
                "&:active": {
                  boxShadow: "none",
                },
              }}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowConfirmation(false);
                setSelectedPost(null);
              }}
              sx={{
                backgroundColor: "#000000",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
                "&:active": {
                  boxShadow: "none",
                },
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
