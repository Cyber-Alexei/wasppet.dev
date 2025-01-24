import { useContext } from "react";
import { MainContext } from '@/context/main_context';

export const useMainContext = () => {
    const context = useContext(MainContext)

    if (context === undefined) {
        throw new Error("The context's provider is not wrapping the app")
    }

    return context;
}