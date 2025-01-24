import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useMainContext } from "@/hooks/main_context";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GetAppIcon from "@mui/icons-material/GetApp";
import CommentIcon from "@mui/icons-material/Comment";
import { post, comment } from "@/interfaces/general_use_interfaces";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

export const UpDownVotes = ({
  post,
  setReloadPosts,
  comment,
  setReloadComments,
  controller,
}: {
  post?: post;
  setReloadPosts?: Dispatch<SetStateAction<number>>;
  comment?: comment;
  setReloadComments?: Dispatch<SetStateAction<number>>;
  controller: (data: any) => Promise<any>;
}): JSX.Element => {
  // Context -----------------

  const { darkModeEnabled } = useMainContext();
  const { userAuth, setReloadUserAuthData } = useUserAuthContext();

  // State ------------------

  const [userVoteThisItem, setUserVoteThisItem] = useState<
    "up" | "down" | null
  >(null);

  // Handle events -----------

  const onUpAndDownVote = async (action: string) => {
    // Protect the execution for TS
    if (!userAuth) return;
    if (controller.name === "upAndDownVotesPost" && post && setReloadPosts) {
      const controllerResponse = await controller({
        user_id: userAuth?.id,
        post_id: post.id,
        action: action,
      });
      if (controllerResponse.success === true) {
        setReloadUserAuthData((prevState) => prevState + 1);
        setReloadPosts((prevState) => prevState + 1);
      }
    }
    if (
      controller.name === "upAndDownVotesComment" &&
      comment &&
      setReloadComments
    ) {
      const controllerResponse = await controller({
        user_id: userAuth?.id,
        comment_id: comment.id,
        action: action,
      });
      if (controllerResponse.success === true) {
        const currentUrl = window.location.href;
        const hashCharacterIndex = currentUrl.indexOf("#");
        const postOriginalUrl = currentUrl.substring(0, hashCharacterIndex);
        window.history.pushState({}, "", postOriginalUrl);
        setReloadComments((prevState) => prevState + 1);
      }
    }
  };

  // useEffect ---------------

  useEffect(() => {
    if (post) {
      // Check if user vote this post
      if (!userAuth) return; // Protect the execution for TS
      if (post.users_who_vote_down?.includes(userAuth?.id)) {
        setUserVoteThisItem("down");
      } else if (post?.users_who_vote_up?.includes(userAuth?.id)) {
        setUserVoteThisItem("up");
      } else {
        setUserVoteThisItem(null);
      }
    }
    if (comment) {
      // Check if user vote this comment
      if (!userAuth) return; // Protect the execution for TS
      if (comment.users_who_vote_down?.includes(userAuth?.id)) {
        setUserVoteThisItem("down");
      } else if (comment.users_who_vote_up?.includes(userAuth?.id)) {
        setUserVoteThisItem("up");
      } else {
        setUserVoteThisItem(null);
      }
    }
  }, [post, comment]);

  // JSX ---------------------

  return (
    <div className="flex gap-4">
      {userAuth && (
        <div
          className="flex text-custom-light-gray-2"
          onClick={() => onUpAndDownVote("up")}
        >
          <FileUploadIcon
            className={`cursor-pointer ${
              userVoteThisItem === "up" ? "text-blue-500" : "text-primary-color"
            }`}
          />
          {post?.users_who_vote_down && post.users_who_vote_up && (
            <p>
              {post.users_who_vote_up?.length -
                post.users_who_vote_down?.length}
            </p>
          )}
          {comment?.users_who_vote_down && comment.users_who_vote_up && (
            <p>
              {comment.users_who_vote_up?.length -
                comment.users_who_vote_down?.length}
            </p>
          )}
        </div>
      )}
      {userAuth && (
        <div
          className="text-custom-light-gray-2"
          onClick={() => onUpAndDownVote("down")}
        >
          <GetAppIcon
            className={`cursor-pointer ${
              userVoteThisItem === "down"
                ? "text-blue-500"
                : "text-primary-color"
            }`}
          />
        </div>
      )}
      {post && (
        <div className="flex gap-2">
          <CommentIcon
            className={`${
              darkModeEnabled
                ? "text-primary-font-color"
                : "text-custom-light-gray-2"
            }`}
          />
          <p
            className={`${
              darkModeEnabled
                ? "text-primary-font-color"
                : "text-custom-light-gray-2"
            }`}
          >
            {post?.users_who_comment?.length || 0}
          </p>
        </div>
      )}
    </div>
  );
};
