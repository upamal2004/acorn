import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser, getRoom, getMembers, getExpenses } from "@/lib/queries";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/onboarding");
  if (!user.roomId) redirect("/onboarding");

  const [room, members, expenses] = await Promise.all([
    getRoom(user.roomId),
    getMembers(user.roomId),
    getExpenses(user.roomId),
  ]);

  return <Dashboard user={user} room={room} members={members} expenses={expenses} />;
}
