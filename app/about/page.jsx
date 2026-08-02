import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AboutPage } from "@/components/AboutPage";

export const metadata = {
  title: "About — Acorn",
};

export default async function About() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <AboutPage />;
}
