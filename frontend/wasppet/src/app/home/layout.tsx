"use client";
import "@/styles/globals.css";
import { Header } from "@/components/header/header_home/header";
import { setUserUsingToken } from "@/controllers/login";
import { useUserAuthContext } from "@/hooks/user_auth_context";
import { useMainContext } from "@/hooks/main_context";
import { MonacoProvider } from "@/context/monaco_context";
import { GeneralModal } from "@/components/modal/general_modal";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Router ---------------------------------------

  const router = useRouter();

  // Context --------------------------------------

  const { userAuth, setUserAuth, reloadUserAuthData } = useUserAuthContext();
  const { generalModal } = useMainContext();

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
        } else {
          router.push("/");
        }
      })();
    } else {
      router.push("/");
    }
  }, [reloadUserAuthData, router, setUserAuth]);

  // JSX --------------------------------------------

  if (userAuth)
    return (
      <MonacoProvider>
        <main>
          <Header />
          {children}
        </main>
        {generalModal && <GeneralModal />}
      </MonacoProvider>
    );
}
