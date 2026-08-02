import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/queries";
import { SettingsPage } from "@/components/SettingsPage";

export const dynamic = "force-dynamic";

export default async function SettingsRoute() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  return <SettingsPage user={user} />;
}
