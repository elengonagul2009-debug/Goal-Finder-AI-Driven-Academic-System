// src/auth/ProtectedVerifiedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, reload } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function ProtectedVerifiedRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Ensure emailVerified is fresh (important after clicking the email link)
        try {
          await reload(u);
        } catch {}
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    // Minimal full-screen loader (prevents blank page feeling)
    return (
      <div className="min-h-screen grid place-items-center bg-black/5">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    // not signed in -> send to login/signup and remember where they wanted to go
    return <Navigate to="/signup" replace state={{ from: location }} />;
  }

  if (!user.emailVerified) {
    // signed in but not verified -> verify page
    return <Navigate to="/verify-email" replace state={{ from: location }} />;
  }

  return children;
}
