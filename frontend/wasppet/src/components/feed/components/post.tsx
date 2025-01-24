import { useMainContext } from "@/hooks/main_context";
import { post } from "@/interfaces/general_use_interfaces";
import { getSingleUser } from "@/controllers/user";
import { VAR } from "@/utils/variables";
import { UpDownVotes } from "@/components/up_down_votes/up_down_votes";
import { upAndDownVotesPost } from "@/controllers/post";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

export const Post = ({
  postItem,
  setReloadPosts,
}: {
  postItem: post;
  setReloadPosts: Dispatch<SetStateAction<number>>;
}): JSX.Element => {
  // Router -----------------

  const router = useRouter();

  // Context -----------------

  const { darkModeEnabled } = useMainContext();

  // State -------------------

  const [postUser, setPostUser] = useState<any>(null);

  // Handle events -----------

  const onClickPostTitle = () => {
    router.push(`${postItem.share_url}${postItem.id}/`);
  };

  // useEffect ---------------

  useEffect(() => {
    (async () => {
      const controllerResponse = await getSingleUser({ id: postItem.user });
      if (controllerResponse.success === true) {
        setPostUser(controllerResponse.detail);
      }
    })();
  }, []);

  // Functions ----------------

  const secondKey = Object.keys(postItem.post).find(
    (key) => key !== "h1-1" && postItem.post[key].value
  );

  // JSX -----------------------

  return (
    <div
      className={`flex flex-col gap-2 p-4 my-10 border-b ${
        darkModeEnabled
          ? "text-primary-font-color border-black"
          : "text-primary-background border-custom-light-gray"
      }`}
    >
      <div className="flex">
        <h2
          className="text-[20px] underline cursor-pointer"
          onClick={onClickPostTitle}
        >
          {postItem.title}
        </h2>
      </div>
      {secondKey && (
        <p className="text-custom-light-gray-2">
          {postItem.post[secondKey].value}
        </p>
      )}
      {postUser && (
        <div className="grid grid-flow-col items-center justify-start h-[60px] items-center gap-2">
          <div
            className="h-[60px] w-[60px] bg-cover bg-center rounded-[100%]"
            style={{backgroundImage: `url(${VAR.BACKEND_URL + postUser.avatar})`}}
          >
          </div>
          <p>{postUser.complete_name}</p>
        </div>
      )}
      {/*PANEL*/}
      <UpDownVotes
        post={postItem}
        setReloadPosts={setReloadPosts}
        controller={upAndDownVotesPost}
      />
      {/*PANEL*/}
    </div>
  );
};
