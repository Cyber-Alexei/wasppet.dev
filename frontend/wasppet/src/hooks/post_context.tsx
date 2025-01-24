import { useContext } from "react";
import { PostContext } from "@/context/post_context";

export const usePostContext = () => {
    const context = useContext(PostContext);

    if (context === undefined) {
        throw new Error("The context's provider is not wrapping the app - PostProvider")
    }

    return context;
}