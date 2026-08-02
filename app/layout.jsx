import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { PushManager } from "@/components/PushManager";
import { SplashScreen } from "@/components/SplashScreen";

export const metadata = {
  title: "Acorn · Split rent, bills & groceries with roommates",
  description:
    "Acorn keeps a single shared room ledger for rent, bills and groceries — see who owes whom, and settle it in one tap.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SplashScreen />
          <PushManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
