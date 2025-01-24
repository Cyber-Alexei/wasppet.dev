"use client";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadUserAvatar } from "@/controllers/user";
import ImageCompressor from "js-image-compressor";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useEffect, useState } from "react";



export const UploadUserAvatar = ({
  user_id,
}: {
  user_id: number;
}): JSX.Element | null => {
  // Context ---------------------------------

  const { setReloadUserAuthData } = useUserAuthContext();

  // State -----------------------------------

  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Functions -------------------------------

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Handle events ---------------------------

  const onAvatarUpload = async (files: any) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      return;
    }

    try {
      const options = {
        file: file,
        quality: 1,
        mimeType: "image/jpeg",
        maxWidth: 1920,
        maxHeight: 1920,
        width: 1920,
        height: 1920,
        minWidth: 500,
        minHeight: 500,
        convertSize: Infinity,
        loose: true,
        redressOrientation: true,

        // Compression success callback
        success: function (result: any) {
          if (!user_id) return;
          (async () => {
            const controllerResult = await uploadUserAvatar(result, user_id);
            console.log(controllerResult, "CR");
            if (controllerResult.success === true) {
              setReloadUserAuthData((prevState) => prevState + 1);
            }
          })();
        },

        // An error occurred
        error: function (msg: string) {
          throw new Error(msg);
        },
      };

      if (typeof window !== 'undefined') {
        new ImageCompressor(options);
      }
      
    } catch (error) {
      throw error
    }
  };

  // useEffect -------------------------------

  useEffect(() => {
    if (window.location.href.includes("people")) {
      setIsVisible(false);
    }
  }, []);

  // JSX -------------------------------------
  if (!isVisible) return null;
  return (
    <Button
      component="label"
      role={undefined}  
      variant="contained"
      tabIndex={-1}
      sx={{
        padding: "2px 3px",
      }}
    >
      <CloudUploadIcon sx={{ fontSize: "20px" }} />
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => onAvatarUpload(event.target.files)}
        accept="image/*"
      />
    </Button>
  );
};
