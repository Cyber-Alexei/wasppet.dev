import ForumIcon from "@mui/icons-material/Forum";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { usePostContext } from "@/hooks/post_context";
import Button from "@mui/material/Button";
import {
  publishNewComment,
  getAllPostComments,
  upAndDownVotesComment,
  editComment,
  deleteComment,
} from "@/controllers/comment";
import { createNewNotification } from "@/controllers/notification";
import {
  userAuthInterface,
  comment,
} from "@/interfaces/general_use_interfaces";
import { getMultipleUsers } from "@/controllers/user";
import { VAR } from "@/utils/variables";
import { UpDownVotes } from "@/components/up_down_votes/up_down_votes";
import { CommentReplies } from "@/components/comments/replies";
import EditIcon from "@mui/icons-material/Edit";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DeleteCommentModal } from "../modal/delete_comment_modal";
import { post } from "@/interfaces/general_use_interfaces";
import { useRouter } from "next/navigation";

export const Comments = ({
  post,
  postAbsoluteUrl,
  darkModeEnabled,
  usersWhoComment,
  setReloadPosts,
}: {
  post: post;
  postAbsoluteUrl: string;
  darkModeEnabled: boolean;
  usersWhoComment: number[] | undefined;
  setReloadPosts: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  // Router -----------------------

  const router = useRouter();

  // Context ----------------------

  const { userAuth } = useUserAuthContext();
  const { showComments, setShowComments } = usePostContext();

  // State ------------------------

  const [newComment, setNewComment] = useState<string>("");
  const [commentInEdit, setCommentInEdit] = useState<comment | null>(null);
  const [reloadComments, setReloadComments] = useState<number>(0);
  const [newCommentMessage, setNewCommentMessage] = useState<string | null>(
    null,
  );
  const [postComments, setPostComments] = useState<comment[] | null>(null);
  const [usersInComments, setUsersInComments] = useState<
    userAuthInterface[] | null
  >(null);
  const [selectedComment, setSelectedComment] = useState<comment | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  ////////////////////// For Notifications ----------
  const [commentIdRepliesToShow, setCommentIdRepliesToShow] = useState<
    number | null
  >(null);
  const [
    openResponseOfNotificationComment,
    setOpenResponseOfNotificationComment,
  ] = useState<any>(null);
  const [repliesLoaded, setRepliesLoaded] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  ///////////////////////////////////////////////////////

  // Handle events ----------------

  const onPublishComment = async () => {
    if (newComment.length < 1 || !userAuth?.id || !post.id || !currentUrl)
      return;
    // Undo the notification redirection url to avoid keep redirecting
    const hashCharacterIndex = currentUrl.indexOf("#");
    let postOriginalUrl;
    if (hashCharacterIndex > 0) {
      postOriginalUrl = currentUrl.substring(0, hashCharacterIndex);
    } else {
      postOriginalUrl = currentUrl;
    }
    window.history.pushState({}, "", postOriginalUrl);
    ////////////////////////////////////////////////

    let controllerResponse;

    // New comment is being published
    if (commentInEdit === null) {
      const dataToSend = {
        user: userAuth?.id,
        post: Number(post.id),
        content: newComment,
        updated_at: new Date(),
      };
      controllerResponse = await publishNewComment(dataToSend);
      // Create the notification
      if (controllerResponse.success === true) {
        const dataToSend = {
          from_user: userAuth.id,
          to_user: post.user,
          message: `has commented your post "${post.title}"`,
          url: `${postOriginalUrl}#comment-${controllerResponse.detail.id}`,
        };
        await createNewNotification(dataToSend);
      }

      // A comment is being edited
    } else {
      const dataToSend = {
        id: commentInEdit.id,
        content: newComment,
      };
      controllerResponse = await editComment(dataToSend);
    }

    if (controllerResponse?.success === true) {
      setNewCommentMessage("Your comment has been published");
      setNewComment("");
      setReloadPosts((prevState) => prevState + 1);
      setReloadComments((prevState) => prevState + 1);
      if (commentInEdit) setCommentInEdit(null);
    } else {
      setNewCommentMessage("There was an error publishing the comment");
    }

    setTimeout(() => {
      setNewCommentMessage(null);
    }, 4000);
  };

  // Prepare the edition of a comment
  const onEditComment = async (commentObj: comment, userOwnerId: number) => {
    if (userAuth?.id !== userOwnerId) return;
    setNewComment(commentObj.content);
    router.replace("#comments");
    setCommentInEdit(commentObj);
  };

  const onShowResponses = (comment_id: number) => {
    if (comment_id === commentIdRepliesToShow) {
      setCommentIdRepliesToShow(null);
    } else {
      setCommentIdRepliesToShow(comment_id);
    }
  };

  const onClickToConfirmDelete = async () => {
    if (!selectedComment || !selectedComment.id) return;

    const controllerResponse = await deleteComment({
      id: selectedComment.id,
      ownerUserId: selectedComment.user,
      postId: Number(post.id),
      responses: selectedComment.responses,
    });

    if (controllerResponse.success === true) {
      setShowConfirmation(false);
      setSelectedComment(null);
      setReloadPosts((prevState) => prevState + 1);
      setReloadComments((prevState) => prevState + 1);
    }
  };

  // useEffect --------------------

  // Get all comments of the post ----------------
  useEffect(() => {
    (async () => {
      const controllerResponse = await getAllPostComments(Number(post.id));
      if (controllerResponse.success === true) {
        setPostComments(controllerResponse.detail);
      } else {
        setPostComments(null);
      }
    })();
  }, [reloadComments]);

  // Get all users who comment the post ----------
  useEffect(() => {
    (async () => {
      if (usersWhoComment === null || usersWhoComment === undefined) return;
      const controllerResponse = await getMultipleUsers(usersWhoComment);
      if (controllerResponse.success === true) {
        setUsersInComments(controllerResponse.detail);
      }
    })();
  }, [usersWhoComment]);

  ///////////////////// For notifications --------------------------------------
  // Open the main comment to redirect a notification
  useEffect(() => {
    // Find the comment element in the DOM
    if (!currentUrl) return;
    if (currentUrl.includes("#")) {
      const hashIndex = currentUrl.indexOf("#");
      const tubeIndex = currentUrl.indexOf("|");
      let mainCommentId;
      if (tubeIndex > 0) {
        mainCommentId = currentUrl.substring(hashIndex + 1, tubeIndex);
      } else {
        mainCommentId = currentUrl.substring(hashIndex + 1);
      }
      const commentToScrollTo = document.getElementById(mainCommentId);

      // Redirect to the main comment of the notification
      if (commentToScrollTo && !currentUrl.includes("|")) {
        commentToScrollTo.scrollIntoView({ behavior: "smooth" });
        if (darkModeEnabled) {
          commentToScrollTo.style.backgroundColor = `var(--primary-background)`;
        } else {
          commentToScrollTo.style.backgroundColor = `var(--secondary-background)`;
        }
        setTimeout(() => {
          commentToScrollTo.style.removeProperty("background-color");
        }, 1000);
      }

      // Open the replies of the main comment in case of redirect to a reply
      // Set the response to which the user will be scrolled
      if (currentUrl.includes("|")) {
        const scoreIndex = mainCommentId.indexOf("-");
        const mainCommentIdNumber = mainCommentId.substring(scoreIndex + 1);

        onShowResponses(Number(mainCommentIdNumber));

        const tubeIndex = currentUrl.indexOf("|");
        const replyId = currentUrl.substring(tubeIndex + 1);

        setOpenResponseOfNotificationComment(replyId);
      }
    }
  }, [postComments, currentUrl]);

  // Redirect the user to the comment reply of the notification (in case)
  useEffect(() => {
    if (
      !openResponseOfNotificationComment ||
      !commentIdRepliesToShow ||
      repliesLoaded === false
    ) {
      return;
    }

    const replyToScrollTo = document.getElementById(
      openResponseOfNotificationComment,
    );

    if (replyToScrollTo) {
      replyToScrollTo.scrollIntoView({ behavior: "smooth" });

      if (darkModeEnabled) {
        replyToScrollTo.style.backgroundColor = `var(--primary-background)`;
      } else {
        replyToScrollTo.style.backgroundColor = `var(--secondary-background)`;
      }
      setTimeout(() => {
        replyToScrollTo.style.removeProperty("background-color");
      }, 1000);
    }
  }, [
    openResponseOfNotificationComment,
    commentIdRepliesToShow,
    repliesLoaded,
  ]);

  // Set the current URL
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [reloadComments]);
  ///////////////////////////////////////////////////////////////////////////////////

  // JSX -----------------------------------------------------------------------------------

  return (
    <>
      <div
        id="comments"
        className={`sticky rounded-tr-md rounded-tl-md bottom-0 h-[43px] w-[150px] bg-primary-color`}
      >
        <div
          className={`cursor-pointer h-full flex items-center gap-3 justify-center text-primary-font-color`}
          onClick={() => {
            setShowComments((prevState) => !prevState);
            router.push("#tg");
          }}
        >
          {showComments === false && <ForumIcon sx={{ fontSize: "35px" }} />}
          {showComments && <CloseIcon sx={{ fontSize: "35px" }} />}
          <p id="tg" className="font-medium">
            Comments
          </p>
        </div>
      </div>

      {showComments && (
        <div
          id="comments-list"
          className={`px-2 py-4 ${
            darkModeEnabled ? "bg-fourth-background" : "bg-gray-100"
          }`}
        >
          {userAuth && (
            <div className="relative flex flex-col gap-2 items-end justify-center">
              {commentInEdit && (
                <div
                  className={`absolute top-1 px-2 ${
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
                        setCommentInEdit(null);
                        setNewComment("");
                      }}
                    >
                      <CancelIcon className="text-primary-color" />
                    </span>
                  </p>
                </div>
              )}
              <textarea
                className={`w-full pb-2 px-4 outline-none rounded-md ${
                  darkModeEnabled
                    ? "bg-primary-background text-primary-font-color"
                    : "bg-secondary-background text-primary-background"
                } ${commentInEdit ? "pt-8" : "pt-2"}`}
                placeholder="Write a comment"
                value={newComment}
                onChange={({ target: { value } }) => setNewComment(value)}
              />
              <div className="flex gap-4 w-full justify-end mb-4">
                {newCommentMessage && (
                  <div
                    className={`flex flex-grow rounded-sm items-center px-4 ${
                      darkModeEnabled
                        ? "bg-fourth-background text-primary-font-color"
                        : "bg-gray-100 text-primary-background"
                    }`}
                  >
                    <p>{newCommentMessage}</p>
                  </div>
                )}
                <Button
                  className="w-[100px] flex-shrink-0"
                  onClick={onPublishComment}
                  variant="contained"
                >
                  {commentInEdit ? "Update" : "Publish"}
                </Button>
              </div>
            </div>
          )}
          <div
            className={`w-full border-t ${
              darkModeEnabled ? "border-black" : "border-custom-light-gray"
            }`}
          >
            {postComments !== null &&
              usersInComments !== null &&
              postComments.map((comment: comment) => {
                const user = usersInComments.find(
                  (user) => user.id === comment.user,
                );
                {
                  /*COMMENT BOX*/
                }
                return (
                  <div
                    id={`comment-${comment.id}`}
                    key={comment.id}
                    className={`relative flex flex-col transition-all duration-300 items-end gap-2 p-4 border-b rounded-sm ${
                      darkModeEnabled
                        ? "bg-fourth-background text-primary-font-color border-black"
                        : "bg-gray-100 text-primary-background border-custom-light-gray"
                    }`}
                  >
                    {/*DELETE COMMENT MODAL*/}
                    {showConfirmation &&
                      comment?.id === selectedComment?.id && (
                        <DeleteCommentModal
                          onClickToConfirmDelete={onClickToConfirmDelete}
                          setShowConfirmation={setShowConfirmation}
                          setSelectedComment={setSelectedComment}
                        />
                      )}
                    {/*DELETE COMMENT MODAL*/}
                    {/*EDIT ICON*/}
                    {userAuth?.id === comment.user && (
                      <div className="absolute flex gap-4 top-5 right-5">
                        <EditIcon
                          className="cursor-pointer"
                          onClick={() => onEditComment(comment, comment.user)}
                        />
                        <DeleteOutlineIcon
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedComment(comment);
                            setShowConfirmation((prevState) => !prevState);
                          }}
                        />
                      </div>
                    )}
                    {/*EDIT ICON*/}
                    <div className="flex flex-col gap-4 w-[100%]">
                      <div className="h-[60px]">
                        <div
                          className="rounded-[100%] cursor-pointer bg-cover bg-center h-[60px] w-[60px]"
                          style={{
                            backgroundImage: `url(${VAR.BACKEND_URL}${user?.avatar})`,
                          }}
                          onClick={() =>
                            router.push(`/people/${user?.username}`)
                          }
                        ></div>
                      </div>
                      <p
                        className="font-medium cursor-pointer hover:underline"
                        onClick={() => router.push(`/people/${user?.username}`)}
                      >
                        {user?.complete_name}:
                      </p>
                      <p>{comment.content}</p>
                      <div className="flex gap-4">
                        <UpDownVotes
                          comment={comment}
                          controller={upAndDownVotesComment}
                          setReloadComments={setReloadComments}
                        />
                        <div
                          className={`flex gap-2 ${
                            darkModeEnabled
                              ? "text-primary-font-color"
                              : "text-primary-background"
                          }`}
                          onClick={() => onShowResponses(comment.id)}
                        >
                          <PeopleIcon />
                          <p>{comment.responses.length || 0}</p>
                          <div className="cursor-pointer">Reply</div>
                        </div>
                      </div>
                    </div>
                    {commentIdRepliesToShow === comment.id && (
                      <div
                        id={`response-of-${comment.id}`}
                        className={`w-[90%] rounded-sm mt-4`}
                      >
                        <CommentReplies
                          darkModeEnabled={darkModeEnabled}
                          commentReplies={comment.responses}
                          parentComment={comment}
                          postid={String(post.id)}
                          usersInComments={usersInComments}
                          setReloadComments={setReloadComments}
                          setReloadPosts={setReloadPosts}
                          setRepliesLoaded={setRepliesLoaded}
                        />
                      </div>
                    )}
                  </div>
                );
                {
                  /*COMMENT BOX*/
                }
              })}
          </div>
        </div>
      )}
      <div className={`h-10 ${showComments ? "" : "hidden"}`}></div>
    </>
  );
};
