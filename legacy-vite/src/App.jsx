// ---------------------------------------------------------------------------
// App.jsx — the root component. Renders the correct "screen" based on auth:
//
//   loading    → Splash        (Firebase Auth is still initializing)
//   signed out → Landing       (Google Sign-In)
//   no room    → Onboarding    (create or join a room)
//   has room   → Dashboard     (wallet + expenses)
//
// The transition from Onboarding → Dashboard happens automatically because the
// profile is kept in sync with Firestore via a live listener.
// ---------------------------------------------------------------------------
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Splash from "./components/Splash.jsx";
import Landing from "./components/Landing.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { loading, user, profile } = useAuth();

  if (loading) return <Splash />;
  if (!user) return <Landing />;
  if (!profile?.roomId) return <Onboarding />;
  return <Dashboard />;
}
