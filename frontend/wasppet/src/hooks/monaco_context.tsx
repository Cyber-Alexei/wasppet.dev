import { useContext } from "react";
import { MonacoContext } from '@/context/monaco_context';

export const useMonacoContext = () => {
    const context = useContext(MonacoContext)

    if (context === undefined) {
        throw new Error("The context's provider is not wrapping the app")
    }

    return context;
}