import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser, getRoom, getMembers, getExpenses, getPersonalExpenses } from "@/lib/queries";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  // Personal mode: no room yet — show the user's own wallet + expenses and
  // invite them to create/join a room for splitting.
  if (!user.roomId) {
    const personalExpenses = await getPersonalExpenses(user.id);
    return <Dashboard user={user} room={null} members={[user]} expenses={personalExpenses} />;
  }

  const [room, members, expenses] = await Promise.all([
    getRoom(user.roomId),
    getMembers(user.roomId),
    getExpenses(user.roomId),
  ]);

  return <Dashboard user={user} room={room} members={members} expenses={expenses} />;
}
