"use client";
import "@/styles/globals.css";
import { MainProvider } from "@/context/main_context";
import { UserAuthProvider } from "@/context/user_auth_context";
import { PostProvider } from "@/context/post_context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html id="html" lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>

      <body id="body-id" className="bg-primary-background overflow-x-hidden">
        <UserAuthProvider>
          <MainProvider>
            <PostProvider>{children}</PostProvider>
          </MainProvider>
        </UserAuthProvider>
      </body>
    </html>
  );
}
