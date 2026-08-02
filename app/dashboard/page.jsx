import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser, getMembers, getExpenses, getPersonalExpenses } from "@/lib/queries";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  if (!user.roomId) {
    const personalExpenses = await getPersonalExpenses(user.id);
    return <Dashboard user={user} room={null} members={[user]} expenses={personalExpenses} />;
  }

  const [members, expenses] = await Promise.all([
    getMembers(user.roomId),
    getExpenses(user.roomId, user.id),
  ]);

  return <Dashboard user={user} room={user.room} members={members} expenses={expenses} />;
}
