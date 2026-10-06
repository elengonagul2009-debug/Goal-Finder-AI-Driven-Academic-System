// src/pages/Signup.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";

const EMAIL_KEY = "gf_last_email";
const REMEMBER_KEY = "gf_remember";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
    remember: true, // default to on; user can uncheck
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.name.trim()) return setErr("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr("Enter a valid email.");
    if (form.password.length < 6) return setErr("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setErr("Passwords do not match.");
    if (!form.agree) return setErr("Please accept Terms & Privacy.");

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      await sendEmailVerification(cred.user);

      // Save only email if the user wants to “save login”
      if (form.remember) {
        localStorage.setItem(REMEMBER_KEY, "1");
        localStorage.setItem(EMAIL_KEY, form.email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
        localStorage.removeItem(EMAIL_KEY);
      }

      // Go to verification screen
      navigate("/verify-email");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
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

      {/* Page layout: header + content fills screen */}
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
              className="hover:text-teal-400"
              style={{ background: "none", border: "none", outline: "none" }}
            >
              Login
            </button>
            <button
              className="bg-teal-500 px-4 py-2 rounded-md hover:bg-teal-600"
              style={{ background: "none", border: "none", outline: "none" }}
            >
              Sign Up
            </button>
          </nav>
        </header>

        {/* Content fills remaining height; only this area scrolls if needed */}
        <main className="h-full overflow-auto flex items-center justify-center px-4 py-6">
          {/* Responsive card */}
          <div className="bg-white text-gray-800 rounded-2xl shadow-xl w-[92vw] max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl p-6 md:p-8 lg:p-10">
            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-4 text-black font-semibold hover:text-gray-700 transition-colors duration-200"
              title="Go Back"
              style={{ background: "none", border: "none", outline: "none" }}
            >
              <span className="text-3xl leading-none">←</span>
              <span className="hidden sm:inline text-lg">Back</span>
            </button>

            <div className="flex flex-col items-center mb-6">
              <div className="bg-teal-100 text-teal-600 rounded-full p-3 text-2xl">👤</div>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 text-center">Create Account</h2>
              <p className="text-sm text-gray-500 text-center">
                Start your career guidance journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4" autoComplete="on">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-teal-400 outline-none"
                    autoComplete="name"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-teal-400 outline-none"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      value={form.password}
                      onChange={onChange}
                      type={showPwd ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full border rounded-lg px-3 pr-10 py-2 mt-1 focus:ring-2 focus:ring-teal-400 outline-none"
                      autoComplete="new-password"
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

                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <input
                      name="confirm"
                      value={form.confirm}
                      onChange={onChange}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      className="w-full border rounded-lg px-3 pr-10 py-2 mt-1 focus:ring-2 focus:ring-teal-400 outline-none"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-gray-500 hover:text-gray-700"
                      style={{ background: "none", border: "none", outline: "none" }}
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input
                  name="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={onChange}
                  className="mt-[3px]"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-teal-600 hover:underline">Terms & Conditions</a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>.
                </span>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  name="remember"
                  type="checkbox"
                  checked={form.remember}
                  onChange={onChange}
                />
                Save login on this device (email only)
              </label>

              {err && <p className="text-sm text-red-600">{err}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-600 disabled:opacity-60 transition"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-teal-600 hover:underline ml-1"
                style={{ background: "none", border: "none", outline: "none" }}
              >
                Login
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
