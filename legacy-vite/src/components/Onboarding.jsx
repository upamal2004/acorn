import { useState } from "react";
import { DoorOpen, KeyRound, Loader2, PartyPopper, Sparkles, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { createRoom, joinRoom } from "../lib/rooms.js";
import Logo from "./Logo.jsx";

/**
 * First-time onboarding: users who aren't part of a room yet either create a
 * brand-new Peach room or join an existing one with its 6-character code.
 */
export default function Onboarding() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-4 py-8">
      <header className="mx-auto flex max-w-3xl items-center gap-2.5">
        <Logo size={30} />
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          Peach
        </span>
      </header>

      <main className="mx-auto mt-10 max-w-3xl">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome, {user?.displayName?.split(" ")[0] || "friend"}!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-slate-500">
            You're not part of a room yet. Create your own Peach room and share
            the code, or join an existing one.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <CreateRoomCard />
          <JoinRoomCard />
        </div>
      </main>
    </div>
  );
}

// --- Create a room ----------------------------------------------------------

function CreateRoomCard() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCreatedCode("");
    setLoading(true);
    try {
      const { code } = await createRoom({ name, ownerId: user.uid });
      setCreatedCode(code);
      setName("");
    } catch (err) {
      setError(err.message || "Could not create the room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-peach-100 p-2.5 text-peach-600">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Create a Room</h2>
          <p className="text-xs text-slate-500">
            We'll generate a shareable code for you.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="input"
          placeholder="Room name (e.g. Flat 402)"
          value={name}
          maxLength={40}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          Create Room
        </button>
      </form>

      {createdCode && (
        <div className="rounded-xl border border-peach-200 bg-peach-50 p-3 text-center">
          <PartyPopper className="mx-auto mb-1 text-peach-500" size={18} />
          <p className="text-xs text-slate-500">Share this code with friends:</p>
          <p className="mt-1 text-2xl font-extrabold tracking-widest text-peach-600">
            {createdCode}
          </p>
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

// --- Join a room -------------------------------------------------------------

function JoinRoomCard() {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await joinRoom({ code, uid: user.uid });
      setCode("");
    } catch (err) {
      setError(err.message || "Could not join the room.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-coral-50 p-2.5 text-coral-500">
          <KeyRound size={20} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Join a Room</h2>
          <p className="text-xs text-slate-500">
            Enter the code your friend shared.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="input text-center font-mono text-lg font-bold uppercase tracking-widest"
          placeholder="PEACH-9X2"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <button type="submit" disabled={loading} className="btn-secondary">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <DoorOpen size={16} />}
          Join Room
        </button>
      </form>

      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
