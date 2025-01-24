"use client";
import { useMainContext } from "@/hooks/main_context";
import { usePostContext } from "@/hooks/post_context";
import Container from "@mui/material/Container";
import { VAR } from "@/utils/variables";
import { MonacoEditorInstancePostReading } from "@/components/monaco_editor/monaco_post_reading";
import { getSinglePost } from "@/controllers/post";
import { getSingleUserByUsername } from "@/controllers/user";
import { getMultipleSnippets } from "@/controllers/snippet";
import { NextPage } from "next";
import { post, savedSnippetData } from "@/interfaces/general_use_interfaces";
import {
  postEngineItem,
  userAuthInterface,
} from "@/interfaces/general_use_interfaces";
import { useEffect, useState } from "react";
import { relativeDateFormat } from "@/utils/functions/formatting";
import { orderItems } from "@/utils/algorithms/ordering";
import { UpDownVotes } from "@/components/up_down_votes/up_down_votes";
import { ShareMenu } from "@/components/share_menu/share_menu";
import { Comments } from "@/components/comments/comments";
import { upAndDownVotesPost } from "@/controllers/post";
import { useRouter } from "next/navigation";

// Data --------------------

let postUrlString: string;

if (typeof window !== 'undefined') {
  // Get the absolute url of the post
const currentUrl = window.location.href;
// Find the index of the first '#'
const hashIndex = currentUrl.indexOf("#");
// Get the url till the first '#' (in case) or the complete url
postUrlString = hashIndex !== -1 ? currentUrl.substring(0, hashIndex) : currentUrl;
}


const PostSinglePage: NextPage<{
  params: { username: string; title: string; postid: string };
}> = ({ params }) => {
  // Params ------------------
  const { username, title, postid } = params;

  // Router ------------------

  const router = useRouter();

  // Context -----------------

  const { darkModeEnabled } = useMainContext();
  const { styles } = usePostContext();

  // State -------------------

  const [post, setPost] = useState<post | null>(null);
  const [orderedItems, setOrderedItems] = useState<postEngineItem[] | null>(
    null
  );
  const [postOwner, setPostOwner] = useState<userAuthInterface | null>(null);
  const [reloadPosts, setReloadPosts] = useState<number>(0);
  const [loadError, setLoadError] = useState<{ [key: string]: string }>({
    postError: "",
    postOwnerError: "",
  });
  const [postSnippets, setPostSnippets] = useState<savedSnippetData[]>([]);
  

  // useEffect ---------------

  useEffect(() => {
    // Find the user owner
    (async () => {
      const controllerResponse = await getSingleUserByUsername({
        username: username,
      });
      if (controllerResponse.success === true) {
        setPostOwner(controllerResponse.detail);
      } else {
        setLoadError((prevState) => ({
          ...prevState,
          postOwnerError:
            controllerResponse.detail.Detail || "Not Post Owner User Found",
        }));
      }
    })();
  }, []);

  useEffect(() => {
    // Find the post
    (async () => {
      const controllerResponse = await getSinglePost({ id: postid });
      if (controllerResponse.success === true) {
        setPost(controllerResponse.detail);
      } else {
        setLoadError((prevState) => ({
          ...prevState,
          postError: controllerResponse.detail.Detail || "Not Post Found",
        }));
      }
    })();
  }, [reloadPosts]);

  useEffect(() => {
    // Order post items
    if (post) {
      setOrderedItems(orderItems(post.post));

      // Get all the snippets of this post
      (async () => {
        const items = Object.keys(post.post);
        const snippetIds = [];

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const scoreCharacter = item.indexOf("-");
          if (scoreCharacter === -1) return;
          const tag = item.substring(0, scoreCharacter);
          if (tag === "snippet")
            snippetIds.push(post.post[item].snippet.snippetId);
        }
        if (snippetIds.length < 1) return;
        const controllerResponse = await getMultipleSnippets(snippetIds);
        if (controllerResponse.success === false) return;
        setPostSnippets(controllerResponse.detail);
      })();
    }
  }, [post]);

  // Tailwind ----------------

  const errorTextStyle = `font-semibold ${
    darkModeEnabled ? "text-primary-font-color" : "text-primary-background"
  }`;

  // JSX ---------------------

  if (
    post &&
    postOwner &&
    post?.user === postOwner?.id &&
    post.title.trim().replace(/ /g, "-").toLowerCase() === title
  ) {
    return (
      <div
        className={`min-h-[calc(100vh-60px)] ${
          darkModeEnabled ? "bg-primary-background" : "bg-secondary-background"
        }`}
      >
        <Container className="flex flex-col justify-between min-h-[calc(100vh-60px)] pt-4 md:px-10 md:pt-10">
          {/*TEMPLATE REPRESENTATION*/}
          <div
            className={`flex flex-col min-h-[50px] gap-6 rounded-sm ${
              darkModeEnabled
                ? "bg-primary-background text-primary-font-color"
                : "bg-secondary-background text-primary-background"
            }`}
          >
            {orderedItems &&
              orderedItems.map((item: postEngineItem, index: number) => {
                const tag = item.item.substring(0, item.item.indexOf("-"));
                switch (tag) {
                  case "h1":
                    return (
                      <h1 key={index} className={styles.h1}>
                        {item.value}
                      </h1>
                    );
                  case "h2":
                    return (
                      <h2 key={index} className={styles.h2}>
                        {item.value}
                      </h2>
                    );
                  case "h3":
                    return (
                      <h3 key={index} className={styles.h3}>
                        {item.value}
                      </h3>
                    );
                  case "h4":
                    return (
                      <h4 key={index} className={styles.h4}>
                        {item.value}
                      </h4>
                    );
                  case "h5":
                    return (
                      <h5 key={index} className={styles.h5}>
                        {item.value}
                      </h5>
                    );
                  case "h6":
                    return (
                      <h6 key={index} className={styles.h6}>
                        {item.value}
                      </h6>
                    );
                  case "p":
                    return <p key={index}>{item.value}</p>;
                  case "snippet":
                    const snippetItem = postSnippets.find((snippet) => {
                      return snippet.id === item.snippet.snippetId;
                    });
                    if (!snippetItem) return;
                    return (
                      <div
                        key={index}
                        className="border border-primary-color min-w-[300px] w-full mx-auto"
                      >
                        <MonacoEditorInstancePostReading
                          snippetData={snippetItem}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
          </div>
          {/*TEMPLATE REPRESENTATION*/}
          {/*DATA PANEL*/}
          <div
            className={`flex items-center justify-center gap-10 flex-wrap p-4 my-10 rounded-sm ${
              darkModeEnabled
                ? "bg-fourth-background text-primary-font-color"
                : "bg-gray-100 text-primary-background"
            }`}
          >
            <div>
              <div
                className="w-[60px] h-[60px] rounded-[100%] cursor-pointer bg-cover bg-center"
                onClick={() => router.push(`/people/${postOwner.username}`)}
                style={{
                  backgroundImage: `url(${VAR.BACKEND_URL}${postOwner.avatar})`,
                }}
              ></div>
            </div>
            <div>
              <label className="font-semibold">Written by:</label>
              <h2
                className={`underline cursor-pointer font-medium ${
                  darkModeEnabled
                    ? "text-primary-color"
                    : "text-secondary-color"
                }`}
                onClick={() => router.push(`/people/${postOwner.username}`)}
              >{`${postOwner.first_name} ${postOwner.last_name}`}</h2>
            </div>
            <div>
              {post.created_at && (
                <div>
                  <label className="font-semibold">Created:</label>
                  <p>{relativeDateFormat(post.created_at)}</p>
                </div>
              )}
            </div>
            <div>
              {post.updated_at && (
                <div>
                  <label className="font-semibold">Last update:</label>
                  <p>{relativeDateFormat(String(post.updated_at))}</p>
                </div>
              )}
            </div>
            <div>
              <UpDownVotes
                post={post}
                setReloadPosts={setReloadPosts}
                controller={upAndDownVotesPost}
              />
            </div>
            <ShareMenu />
          </div>
          {/*DATA PANEL*/}
          {/*COMMENTS*/}
          {postUrlString && (
            <Comments
              post={post}
              postAbsoluteUrl={postUrlString}
              darkModeEnabled={darkModeEnabled}
              usersWhoComment={post.users_who_comment}
              setReloadPosts={setReloadPosts}
            />
          )}
          {/*COMMENTS*/}
        </Container>
      </div>
    );
  } else {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[calc(100vh-60px)] w-auto ${
          darkModeEnabled ? "bg-primary-background" : "bg-secondary-background"
        }`}
      >
        <div
          className={`flex flex-col gap-4 items-center justify-center mb-[60px] w-[90%] md:w-[60%] rounded-sm py-16 ${
            darkModeEnabled ? "bg-fourth-background" : "bg-gray-100"
          }`}
        >
          <p className={errorTextStyle}>{loadError?.postError}</p>
          <p className={errorTextStyle}>{loadError?.postOwnerError}</p>
        </div>
      </div>
    );
  }
};

export default PostSinglePage;
