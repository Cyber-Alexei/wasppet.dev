import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { VAR } from "@/utils/variables";
import { UpDownVotes } from "@/components/up_down_votes/up_down_votes";
import {
  comment,
  userAuthInterface,
} from "@/interfaces/general_use_interfaces";
import {
  getMultipleComments,
  publishNewReply,
  editComment,
  deleteComment,
  upAndDownVotesComment,
} from "@/controllers/comment";
import { createNewNotification } from "@/controllers/notification";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { DeleteCommentModal } from "@/components/modal/delete_comment_modal";
import { useRouter } from "next/navigation";

export const CommentReplies = ({
  darkModeEnabled,
  commentReplies,
  parentComment,
  postid,
  usersInComments,
  setReloadComments,
  setReloadPosts,
  setRepliesLoaded,
}: {
  darkModeEnabled: boolean;
  commentReplies: number[];
  parentComment: comment;
  postid: string;
  usersInComments: userAuthInterface[];
  setReloadComments: Dispatch<SetStateAction<number>>;
  setReloadPosts: Dispatch<SetStateAction<number>>;
  setRepliesLoaded: Dispatch<SetStateAction<boolean>>;
}): JSX.Element => {
  // Router -----------------

  const router = useRouter();

  // Context ----------------

  const { userAuth } = useUserAuthContext();

  // State ------------------
  const [reply, setReply] = useState<string>("");
  const [replyInEdit, setReplyInEdit] = useState<comment | null>(null);
  const [commentRepliesObjs, setCommentRepliesObjs] = useState<
    comment[] | null
  >(null);
  const [newReplyMessage, setNewReplyMessage] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<comment | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string|null>(null);

  // Handle events ----------

  const onPublishReply = async () => {
    if (reply.length < 1 || !userAuth) return;
    // Undo the notification redirection url (in case of click noti) to avoid keep redirecting
    if (!currentUrl) return;
    const hashCharacterIndex = currentUrl.indexOf("#");
    let postOriginalUrl;
    if (hashCharacterIndex > 0) {
      postOriginalUrl = currentUrl.substring(0, hashCharacterIndex);
    } else {
      postOriginalUrl = currentUrl;
    }
    window.history.pushState({}, "", postOriginalUrl);
    ///////////////////////////////////////////////////////////////////

    let controllerResponse;

    // New reply is being published
    if (replyInEdit === null) {
      const dataToSend = {
        user: userAuth?.id,
        parent_comment_id: parentComment.id,
        post: Number(postid),
        content: reply,
        updated_at: new Date(),
      };
      controllerResponse = await publishNewReply(dataToSend);
      // Create the notification
      if (controllerResponse.success === true) {
        const dataToSend = {
          from_user: userAuth.id,
          to_user: parentComment.user,
          message: `has replied your comment "${parentComment.content.substring(
            0,
            30
          )}"`,
          url: `${postOriginalUrl}#comment-${parentComment.id}|reply-${controllerResponse.detail.id}`,
        };
        await createNewNotification(dataToSend);
      }

      // A reply is being edited
    } else {
      const dataToSend = {
        id: replyInEdit.id,
        content: reply,
      };
      controllerResponse = await editComment(dataToSend);
    }

    if (controllerResponse.success === true) {
      setNewReplyMessage("Your reply has been published");
      setReply("");
      // Reload
      setReloadPosts((prevState) => prevState + 1);
      setReloadComments((prevState) => prevState + 1);
      if (replyInEdit) setReplyInEdit(null);
    } else {
      setNewReplyMessage("There was an error publishing the reply");
    }

    setTimeout(() => {
      setNewReplyMessage(null);
    }, 4000);
  };

  const onEditReply = async (commentObj: comment, userOwnerId: number) => {
    if (userAuth?.id !== userOwnerId) return;
    setReply(commentObj.content);
    router.push(`#comment-${parentComment.id}`);
    setReplyInEdit(commentObj);
  };

  const onClickToConfirmDelete = async () => {
    if (!selectedComment || !selectedComment.id) return;

    const controllerResponse = await deleteComment({
      id: selectedComment.id,
      ownerUserId: selectedComment.user,
      postId: Number(postid),
      responses: selectedComment.responses,
    });
    console.log(controllerResponse, "RC");

    if (controllerResponse.success === true) {
      setShowConfirmation(false);
      setSelectedComment(null);
      setReloadPosts((prevState) => prevState + 1);
      setReloadComments((prevState) => prevState + 1);
    }
  };

  // useEffect --------------

  useEffect(() => {
    // Set the post base URL to use to publish replies with a redirect link in notifications
    setCurrentUrl(window.location.href);

    (async () => {
      if (commentReplies.length < 1) return;
      const controllerResponse = await getMultipleComments({
        ids: commentReplies,
      });

      if (controllerResponse.success === true) {
        setCommentRepliesObjs(controllerResponse.detail);
      } else {
        setCommentRepliesObjs(null);
      }
    })();

  }, [commentReplies]);

  useEffect(() => {
    if (commentRepliesObjs) {
      setRepliesLoaded(true);
    }
  }, [commentRepliesObjs])

  // JSX --------------------

  return (
    <div className="flex flex-col gap-4">
      {userAuth && (
        <div className="relative flex flex-col gap-2">
          {replyInEdit && (
            <div
              className={`absolute top-1 right-0 px-2 ${
                darkModeEnabled
                  ? "text-primary-font-color"
                  : "text-primary-background"
              }`}
            >
              <p>
                Stop editing{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setReplyInEdit(null);
                    setReply("");
                  }}
                >
                  <CancelIcon className="text-primary-color" />
                </span>
              </p>
            </div>
          )}
          <textarea
            className={`w-full outline-none rounded-md px-4 py-2 ${
              darkModeEnabled
                ? "bg-primary-background"
                : "bg-secondary-background"
            } ${replyInEdit ? "pt-8" : "pt-2"}`}
            value={reply}
            onChange={({ target: { value } }) => setReply(value)}
            placeholder="Write a reply"
          />
          <div className="flex gap-4 w-full justify-end">
            {newReplyMessage && (
              <div
                className={`flex flex-grow rounded-sm items-center px-4 ${
                  darkModeEnabled
                    ? "bg-primary-background text-primary-font-color"
                    : "bg-secondary-background text-primary-background"
                }`}
              >
                <p>{newReplyMessage}</p>
              </div>
            )}
            <Button
              className="w-[100px] flex-shrink-0"
              onClick={onPublishReply}
              variant="contained"
            >
              {replyInEdit ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      )}
      <div>
        {commentRepliesObjs &&
          commentRepliesObjs.map((reply) => {
            const user = usersInComments.find((user) => user.id === reply.user);
            return (
              <div
                id={`reply-${reply.id}`}
                key={reply.id}
                className={`relative flex flex-col transition-all duration-300 items-end gap-2 p-4 border-t rounded-sm ${
                  darkModeEnabled
                    ? "bg-fourth-background text-primary-font-color border-black"
                    : "bg-gray-100 text-primary-background border-custom-light-gray"
                }`}
              >
                {/*DELETE COMMENT MODAL*/}
                {showConfirmation && reply?.id === selectedComment?.id && (
                  <DeleteCommentModal
                    onClickToConfirmDelete={onClickToConfirmDelete}
                    setShowConfirmation={setShowConfirmation}
                    setSelectedComment={setSelectedComment}
                  />
                )}
                {/*DELETE COMMENT MODAL*/}
                {/*EDIT ICON*/}
                {userAuth?.id === reply.user && (
                  <div className="absolute flex gap-4 top-5 right-5">
                    <EditIcon
                      className="cursor-pointer"
                      onClick={() => onEditReply(reply, reply.user)}
                    />
                    <DeleteOutlineIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedComment(reply);
                        setShowConfirmation((prevState) => !prevState);
                      }}
                    />
                  </div>
                )}
                {/*EDIT ICON*/}
                <div className="flex flex-col gap-4 w-[100%]">
                  <div className="h-[60px]">
                    <div
                      className="bg-cover bg-center rounded-[100%] cursor-pointer h-[60px] w-[60px]"
                      style={{backgroundImage: `url(${VAR.BACKEND_URL}${user?.avatar})`}}
                      onClick={() =>
                        router.push(`/people/${user?.username}`)
                      }
                    >
                    </div>
                  </div>
                  <p
                    className="font-medium cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(`/people/${user?.username}`)
                    }
                  >
                    {user?.complete_name}:
                  </p>
                  <p>{reply.content}</p>
                  <div className="flex gap-4">
                    <UpDownVotes
                      comment={reply}
                      controller={upAndDownVotesComment}
                      setReloadComments={setReloadComments}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
