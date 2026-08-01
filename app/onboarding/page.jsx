import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/queries";
import { Onboarding } from "@/components/Onboarding";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getUser(session.user.id);
  if (profile?.roomId) redirect("/dashboard");

  return <Onboarding user={profile} />;
}
