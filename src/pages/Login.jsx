// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const EMAIL_KEY = "gf_last_email";
const REMEMBER_KEY = "gf_remember";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  // Prefill saved email + remember flag
  useEffect(() => {
    const savedRemember = localStorage.getItem(REMEMBER_KEY) === "1";
    const savedEmail = savedRemember ? localStorage.getItem(EMAIL_KEY) || "" : "";
    setForm((f) => ({ ...f, email: savedEmail, remember: savedRemember }));
  }, []);

  // If already signed in, skip login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) navigate("/academic", { replace: true });
    });
    return () => unsub();
  }, [navigate]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setResetMsg("");

    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr("Enter a valid email.");
    if (!form.password) return setErr("Enter your password.");

    try {
      setLoading(true);

      // Persistence (Remember me -> local, else session)
      await setPersistence(
        auth,
        form.remember ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, form.email, form.password);

      // Save/clear only the email + remember flag (never store password)
      if (form.remember) {
        localStorage.setItem(REMEMBER_KEY, "1");
        localStorage.setItem(EMAIL_KEY, form.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
        localStorage.removeItem(EMAIL_KEY);
      }

      navigate("/academic");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    setErr("");
    setResetMsg("");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setErr("Enter your email above to receive a reset link.");
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetMsg("Password reset email sent. Check your inbox.");
    } catch (e) {
      setErr(e.message);
    }
  }

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

      <div className="relative z-10 h-full grid grid-rows-[auto,1fr]">
        {/* Navbar (fixed height for consistency) */}
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
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md hover:bg-white/10"
              style={{ background: "none", border: "none", boxShadow: "none", outline: "none" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-600"
              style={{ background: "none", border: "none", boxShadow: "none", outline: "none" }}
            >
              Sign Up
            </button>
          </nav>
        </header>

        {/* Content */}
        <main className="h-full overflow-auto flex items-start md:items-center justify-center px-4 py-10 md:py-6">
          <div className="bg-white text-gray-800 rounded-2xl shadow-xl w-[92vw] max-w-md p-6 md:p-8">
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 text-black font-semibold hover:text-gray-700 transition-colors"
              title="Go Back"
              style={{ background: "none", border: "none", outline: "none" }}
            >
              <span className="text-3xl leading-none">←</span>
              <span className="hidden sm:inline text-lg">Back</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto bg-teal-100 text-teal-600 rounded-full p-3 w-fit text-2xl">🔒</div>
              <h2 className="text-2xl md:text-3xl font-extrabold mt-2">Welcome Back</h2>
              <p className="text-sm text-gray-500">Login to continue your journey</p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">📧</span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password with eye toggle */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">🔑</span>
                  <input
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    type={showPwd ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full border rounded-lg pl-9 pr-10 py-2 focus:ring-2 focus:ring-teal-400 outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-gray-500 hover:text-gray-700"
                    style={{ background: "none", border: "none", outline: "none" }}
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Row */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={onChange}
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={onForgot}
                  className="text-teal-600 hover:underline"
                  style={{ background: "none", border: "none", outline: "none" }}
                >
                  Forgot Password?
                </button>
              </div>

              {err && <p className="text-sm text-red-600">{err}</p>}
              {resetMsg && <p className="text-sm text-teal-600">{resetMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-60 transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-teal-600 hover:underline"
                style={{ background: "none", border: "none", outline: "none" }}
              >
                Sign up
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
