import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser, getRoom, getMembers, getExpenses, getPersonalExpenses } from "@/lib/queries";
import { HistoryPage } from "@/components/HistoryPage";

export const dynamic = "force-dynamic";

export default async function HistoryRoute() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUser(session.user.id);
  if (!user) redirect("/login");

  if (!user.roomId) {
    const personalExpenses = await getPersonalExpenses(user.id);
    return <HistoryPage user={user} room={null} members={[user]} expenses={personalExpenses} />;
  }

  const [room, members, expenses] = await Promise.all([
    getRoom(user.roomId),
    getMembers(user.roomId),
    getExpenses(user.roomId, user.id),
  ]);

  return <HistoryPage user={user} room={room} members={members} expenses={expenses} />;
}
