import "@/styles/globals.css";
import CssBaseline from "@mui/material/CssBaseline";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <CssBaseline />
      {children}
    </main>
  );
}
