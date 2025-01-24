"use client";
import { NextPage } from "next";
import { AccountComponent } from "@/components/account/account";
import { useMainContext } from "@/hooks/main_context";
import { getSingleUserByUsername } from "@/controllers/user";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";

const UserSingle: NextPage<{ params: { username: string } }> = ({ params }) => {
  // Params ---------------------

  const { username } = params;

  // Context --------------------

  const { darkModeEnabled } = useMainContext();

  // State -----------------------

  const [user, setUser] = useState<any>(null);

  // useEffect -------------------

  useEffect(() => {
    (async () => {
      const controllerResponse = await getSingleUserByUsername({
        username: username,
      });

      if (controllerResponse.success === true) {
        setUser(controllerResponse.detail);
      }
    })();
  }, []);

  // JSX -------------------------
  if (user === null) return;

  return (
    <div className={`min-h-[calc(100vh-60px)] ${darkModeEnabled ? 'bg-primary-background':'bg-secondary-background'}`}>
      <Container>
        <AccountComponent
          user={user}
          darkModeEnabled={darkModeEnabled}
          accountOwner={false}
        />
      </Container>
    </div>
  );
};

export default UserSingle;
