"use client";
import { createContext, SetStateAction, useState, Dispatch } from "react";
import { userAuthInterface } from "@/interfaces/general_use_interfaces";

// Context interface ------------------------------

interface userAuthContextInterface {
  userAuth: userAuthInterface | null;
  setUserAuth: (stateAction: SetStateAction<userAuthInterface | null>) => void;
  userAuthToken: string;
  setUserAuthToken: (stateAction: SetStateAction<string>) => void;
  reloadUserAuthData: number;
  setReloadUserAuthData: Dispatch<SetStateAction<number>>;
}

// Context creation -------------------------------

export const UserAuthContext = createContext<
  userAuthContextInterface | undefined
>(undefined);

// Provider ---------------------------------------

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

    // State ---------------------------------------

    const [userAuth, setUserAuth] = useState<userAuthInterface | null>(null);
    const [userAuthToken, setUserAuthToken] = useState<string>("");
    const [reloadUserAuthData, setReloadUserAuthData] = useState<number>(0)

    // All data ------------------------------------

    const data = {
        userAuth,
        setUserAuth,
        userAuthToken,
        setUserAuthToken,
        reloadUserAuthData,
        setReloadUserAuthData,
    }

    // JSX ------------------------------------------

    return <UserAuthContext.Provider value={data}>{children}</UserAuthContext.Provider>
};
