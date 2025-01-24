"use client";
import { Header } from "@/components/header/header_general/header";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useEffect } from "react";
import { setUserUsingToken } from "@/controllers/login";
import { PostProvider } from "@/context/post_context";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Context --------------------------------------

  const { setUserAuth, reloadUserAuthData } = useUserAuthContext();

  // Find the user token in local storage ----------

  useEffect(() => {
    const userToken = localStorage.getItem("wasppet.dev_user-token");

    if (userToken) {
      (async () => {
        const controllerResponse = await setUserUsingToken({
          token: userToken,
        });
        if (controllerResponse.success === true) {
          // Set the user owner of the token in the app main context
          setUserAuth(controllerResponse.detail);
        }
      })();
    }
  }, [reloadUserAuthData]);

  // JSX -----------------------

  return (
    <>
      <PostProvider>
        <Header />
        <main>{children}</main>
      </PostProvider>
    </>
  );
}
