// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { sendEmailVerification, reload } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function resend() {
    setErr("");
    try {
      if (!auth.currentUser) return;
      await sendEmailVerification(auth.currentUser);
      setSent(true);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function iveVerified() {
    if (!auth.currentUser) return;
    await reload(auth.currentUser);
    if (auth.currentUser.emailVerified) navigate("/select-class");
  }

  useEffect(() => {
    iveVerified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative h-screen w-screen text-white"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Page layout: header + content fills screen */}
      <div className="relative z-10 h-full grid grid-rows-[auto,1fr]">
        {/* Navbar (same as Signup) */}
        <header className="bg-[#0a1a2f]/95 text-white flex items-center justify-between px-6 md:px-8 py-4 shadow h-[72px]">
<div className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <div className="bg-teal-500 rounded-lg px-2 py-1">G</div>
            Goal Finder
          </div>

          <nav className="hidden sm:flex gap-6 text-sm items-center">
            <a href="#" className="hover:text-teal-400">Home</a>
            <a href="#" className="hover:text-teal-400">About</a>
            <a href="#" className="hover:text-teal-400">Contact</a>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🌙</span>
              <select className="bg-transparent outline-none">
                <option>English</option>
                <option>Tamil</option>
              </select>
            </div>
            <a href="#" className="hover:text-teal-400">Login</a>
            <button className="bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-600">
              Sign Up
            </button>
          </nav>
        </header>

        {/* Content fills remaining height; only this area scrolls if needed */}
        <main className="h-full overflow-auto flex items-center justify-center px-4 py-6">
          {/* Card (same sizing as Signup) */}
          <div className="bg-white text-gray-800 rounded-2xl shadow-xl w-[92vw] max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl p-6 md:p-8 lg:p-10">
            {/* Back (transparent, black text) */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-black font-medium mb-4 hover:text-teal-600 transition-colors duration-200"
              title="Go Back"
              style={{
    background: "none",
    border: "none",
    boxShadow: "none",
    outline: "none",
  }}
            >
              <span className="text-2xl leading-none">←</span>
              <span className="hidden sm:inline">Back</span>
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-teal-100 text-teal-600 rounded-full p-3 text-2xl">✉️</div>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 text-center">Verify your email</h2>
              <p className="text-sm text-gray-500 text-center">
                We’ve sent a verification link to{" "}
                <b>{auth.currentUser?.email || "your email"}</b>. Open your inbox, click the link,
                then press the button below.
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={iveVerified}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
              >
                I’ve verified
              </button>
              <button
                onClick={resend}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700"
              >
                Resend email
              </button>
            </div>

            {sent && (
              <p className="mt-3 text-sm text-teal-600">
                Verification email sent ✅
              </p>
            )}
            {err && (
              <p className="mt-3 text-sm text-red-600">
                {err}
              </p>
            )}

            {/* Helper tip */}
            <p className="mt-6 text-xs text-gray-500">
              Tip: If you don’t see the email, check Spam/Promotions or try Resend.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
