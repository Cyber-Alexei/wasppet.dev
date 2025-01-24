import { useContext } from "react";
import { UserAuthContext } from '@/context/user_auth_context';

export const useUserAuthContext = () => {
    const context = useContext(UserAuthContext)

    if (context === undefined) {
        throw new Error("The context's provider is not wrapping the app")
    }

    return context;
}