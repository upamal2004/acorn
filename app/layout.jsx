import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "Acorn · Split rent, bills & groceries with roommates",
  description:
    "Acorn keeps a single shared room ledger for rent, bills and groceries — see who owes whom, and settle it in one tap.",
  icons: { icon: "/acorn.svg" },
};export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
