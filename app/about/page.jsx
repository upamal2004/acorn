import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/queries";
import { AboutPage } from "@/components/AboutPage";

export const metadata = {
  title: "About — Acorn",
};

export default async function About() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  return <AboutPage user={user} />;
}
