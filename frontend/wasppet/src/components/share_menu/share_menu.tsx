import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "react-share";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import XIcon from "@mui/icons-material/X";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useEffect, useState } from "react";

export const ShareMenu = (): JSX.Element => {
  // State ------------------------------

  const [postUrl, setPostUrl] = useState<string | null>(null);

  // useEffect -------------------------

  useEffect(() => {
    setPostUrl(window.location.href);
  }, []);

  return (
    <div>
      {postUrl && (
        <div className="flex items-start gap-4">
          <FacebookShareButton url={postUrl}>
            <FacebookIcon />
          </FacebookShareButton>
          <WhatsappShareButton url={postUrl}>
            <WhatsAppIcon />
          </WhatsappShareButton>
          <TwitterShareButton url={postUrl}>
            <XIcon />
          </TwitterShareButton>
          <EmailShareButton url={postUrl}>
            <MailOutlineIcon />
          </EmailShareButton>
        </div>
      )}
    </div>
  );
};
