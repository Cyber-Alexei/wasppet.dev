"use client";
import Container from "@mui/material/Container";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useMainContext } from "@/hooks/main_context";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { usePostContext } from "@/hooks/post_context";
// ------------
import { HomeSideBar } from "@/components/home_side_bar/home_side_bar";
import { AccountComponent } from "@/components/account/account";
import { MySnippetsComponent } from "@/components/my-snippets/my-snippets";
import { NewPostComponent } from "@/components/new_post/new_post";
import { FeedComponent } from "@/components/feed/feed";
import { PeopleComponent } from "@/components/people/people";
import { NotificationsComponent } from "@/components/notifications/notifications";


const Home: NextPage = () => {

  // Context ----------------------------------------
  const {
    darkModeEnabled,
    setDarkModeEnabled,
    menuDisplayed,
    setMenuDisplayed,
    dataDisplayed,
  } = useMainContext();

  const { userAuth, setUserAuth } = useUserAuthContext();
  const { setShowComments } = usePostContext();

  // Event handlers ----------------------------------

  const onClickPage = (e: any) => {
    // Divs IDs of the components that will be next to HomeSideBar component
    const e_classes = e.target.className;
    // Ensure the state change is possible,
    // e_classes are the clases (in string),
    // "home_sidebar" NO exists (user can click the side bar and it will not close)
    if (
      menuDisplayed === true &&
      typeof e_classes === "string" &&
      !e_classes.includes("home_sidebar")
    ) {
      setMenuDisplayed(false);
    }
  };

  // State ------------------------------------------

  const [windowHeight, setWindowHeight] = useState<number|null>(null);

  // Handle events -----------------------------------

  const onClickDarkMode = () => {
    // Store the new value of theme in local storage
    const changeThemeBooleanValue = !darkModeEnabled;
    window.localStorage.setItem(
      "wasppet.dev_darktheme",
      JSON.stringify(changeThemeBooleanValue)
    );
    // Chnage the theme
    setDarkModeEnabled(!darkModeEnabled);
  };

  // UseEffect ----------------------------------------

  useEffect(() => {
    const header = document.getElementById("header");
    const body = document.getElementById("body-id");

    if (header && body) {
      if (darkModeEnabled) {
        header.style.backgroundColor = "var(--fourth-background)";
        body.style.background = "var(--primary-background)";
      } else {
        header.style.backgroundColor = "var(--secondary-background)";
        body.style.background = "var(--secondary-background)";
      }
    }
  }, [darkModeEnabled]);

  useEffect(() => {
    if (windowHeight === document.documentElement.scrollHeight) return;
    setWindowHeight(document.documentElement.scrollHeight - 60);
  }, [menuDisplayed])

  useEffect(() => {
    setShowComments(false);
  }, [])

  // JSX ---------------------------------------------

  return (
    <div style={{height: `${windowHeight}px`}} className={`flex`} onClick={onClickPage}>
      <HomeSideBar
        props={{ menuDisplayed, onClickDarkMode, darkModeEnabled }}
      />
      <div className="flex absolute w-full">
        <Container className="flex justify-center">
          {/*FEED*/}
          {dataDisplayed === 'feed' && userAuth && (
            <FeedComponent />
          )}
          {/*ACCOUNT*/}
          {dataDisplayed === 'account' && userAuth && (
            <AccountComponent
            user={userAuth}
            setUserAuth={setUserAuth}
            darkModeEnabled={darkModeEnabled}
            accountOwner={true}
            />
          )}
          {/*NOTIFICATIONS*/}
          {dataDisplayed === 'notifications' && userAuth && (
            <NotificationsComponent userid={userAuth.id} />
          )}
          {/*MY-SNIPPETS*/}
          {dataDisplayed === 'my-snippets' && userAuth && (
            <MySnippetsComponent />
          )}
          {/*NEW-POST*/}
          {dataDisplayed === 'new-post' && userAuth && (
            <NewPostComponent />
          )}
          {/*PEOPLE*/}
          {dataDisplayed === 'people' && userAuth && (
            <PeopleComponent />
          )}
        </Container>
      </div>
    </div>
  );
};

export default Home;