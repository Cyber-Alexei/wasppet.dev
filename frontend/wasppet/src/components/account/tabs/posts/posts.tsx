import { userAuthInterface } from "@/interfaces/general_use_interfaces";
import {
  getAllUserPosts,
  deletePost,
  upAndDownVotesPost,
} from "@/controllers/post";
import { useMainContext } from "@/hooks/main_context";
import { usePostContext } from "@/hooks/post_context";
import { post } from "@/interfaces/general_use_interfaces";
import { UpDownVotes } from "@/components/up_down_votes/up_down_votes";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DeletePostModal } from "@/components/modal/delete_post_modal";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const Posts = ({
  user,
  accountOwner,
}: {
  user: userAuthInterface;
  accountOwner?: boolean;
}): JSX.Element => {
  // Router ------------------

  const router = useRouter();

  // Context -----------------

  const { darkModeEnabled, setDataDisplayed } = useMainContext();
  const { setItems, setPostInUpdateId } = usePostContext();
  const { setReloadUserAuthData } = useUserAuthContext();

  // State -------------------

  const [userPosts, setUserPosts] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadPosts, setReloadPosts] = useState<number>(0);
  const [selectedPost, setSelectedPost] = useState<post | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Handle events ----------

  const onClickPostTitle = (post: post) => {
    router.push(`/${post.share_url}${post.id}/`);
  };

  const onEdit = (post: post) => {
    if (!post.id) return; // The post must have and ID to be updated
    setItems(post.post);
    setPostInUpdateId(post.id);
    setDataDisplayed("new-post");
  };

  const onClickToConfirmDelete = async () => {
    if (!selectedPost || !selectedPost.id) return;
    const voteUpLength = selectedPost.users_who_vote_up?.length ?? 0;
    const voteDownLength = selectedPost.users_who_vote_down?.length ?? 0;

    const upsToRestore = voteUpLength + voteDownLength;
    const invertedUpsToRestore = upsToRestore * -1;

    const controllerResponse = await deletePost({
      id: selectedPost.id,
      upsToRestore: invertedUpsToRestore,
      user: user.id,
    });

    if (controllerResponse.success === true) {
      setShowConfirmation(false);
      setSelectedPost(null);
      setReloadUserAuthData((prevState) => prevState + 1);
      setReloadPosts((prevState) => prevState + 1);
    }
  };

  // useEffect ---------------

  useEffect(() => {
    (async () => {
      const controllerResponse = await getAllUserPosts({ user_id: user.id });
      if (controllerResponse.success === true) {
        setUserPosts(controllerResponse.detail);
      } else {
        setError(
          controllerResponse.detail.Detail || "There was an unexpected error"
        );
      }
    })();
  }, [reloadPosts]);

  // JSX ----------------------

  return (
    <div className="pb-6">
      {error && (
        <div
          className={`flex items-center justify-center w-full min-h-[50px] rounded-sm pb-4`}
        >
          <p className={`${darkModeEnabled ? 'text-primary-font-color':'text-primary-background'}`}>{error}</p>
        </div>
      )}
      <div className={`flex flex-col gap-4 rounded-sm`}>
        {userPosts &&
          userPosts.map((post: post, index: number) => {
            const secondKey = Object.keys(post.post).find(
              (key) => key !== "h1-1" && post.post[key].value
            );
            return (
              <div
                key={index}
                className={`relative px-4 py-4 transition-all duration-300 ${
                  darkModeEnabled
                    ? "text-primary-font-color bg-fourth-background hover:bg-transparent"
                    : "text-primary-background bg-gray-100 hover:bg-transparent"
                }`}
              >
                {showConfirmation &&
                  (post?.id ?? null) === selectedPost?.id && (
                    <DeletePostModal
                      onClickToConfirmDelete={onClickToConfirmDelete}
                      setSelectedPost={setSelectedPost}
                      setShowConfirmation={setShowConfirmation}
                    />
                  )}
                <div className="flex">
                  <h2
                    className="text-[20px] font-semibold cursor-pointer"
                    onClick={() => onClickPostTitle(post)}
                  >
                    {post.title}
                  </h2>
                </div>
                {secondKey && (
                  <p className="text-custom-light-gray-2">
                    {post.post[secondKey].value}
                  </p>
                )}
                <br></br>
                {/*UP AND DOWN BUTTON*/}
                <UpDownVotes
                  post={post}
                  setReloadPosts={setReloadPosts}
                  controller={upAndDownVotesPost}
                />
                {/*UP AND DOWN BUTTON*/}
                <div
                  className={`absolute flex gap-4 top-3 right-4 text-primary-color ${
                    accountOwner ? "" : "hidden"
                  }`}
                >
                  <EditIcon
                    className="cursor-pointer"
                    onClick={() => onEdit(post)}
                  />
                  <DeleteOutlineIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowConfirmation((prevState) => !prevState);
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
