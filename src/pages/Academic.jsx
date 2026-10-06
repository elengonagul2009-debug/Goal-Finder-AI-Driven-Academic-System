// src/pages/Academic.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Academic() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const name = user?.displayName || "Guest";

  async function onLogout() {
    await signOut(auth);
    navigate("/login");
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
      {/* keep a soft transparent overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 h-full grid grid-rows-[auto,1fr]">
        {/* Navbar */}
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
              onClick={onLogout}
              className="hover:text-teal-400"
              style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                outline: "none",
              }}
            >
              Logout
            </button>
            <button
              className="hover:text-teal-400"
              style={{
                background: "none",
                border: "none",
                boxShadow: "none",
                outline: "none",
              }}
            >
              Profile
            </button>
          </nav>
        </header>

        {/* Content */}
        <main className="h-full overflow-auto px-4 md:px-10 py-6 md:py-10">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-teal-300 transition mb-6 md:mb-10"
            title="Back"
            style={{ background: "none", border: "none", outline: "none" }}
          >
            <span className="text-2xl leading-none">←</span>
            <span className="hidden sm:inline text-lg">Back</span>
          </button>

          {/* Title */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Choose Your Academic Level
            </h1>
            <p className="mt-3 md:mt-4 text-white/80 text-base md:text-lg">
              Select the academic level that aligns with your interests and career aspirations.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 max-w-6xl mx-auto">
            {/* 10th Graduated */}
            <button
              onClick={() => navigate("/class-10")}
              className="group text-left rounded-3xl bg-gradient-to-br from-[#1e293b]/95 to-[#334155]/90 hover:from-[#0f172a]/90 hover:to-[#1e293b]/90 text-white transition shadow-2xl p-8 md:p-10 border border-white/10"
            >
              <div className="w-24 h-24 rounded-2xl grid place-items-center bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-5xl mb-6 shadow-lg">
                📖
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                10th Graduated
              </h3>
              <p className="mt-3 text-white/85 text-base md:text-lg">
                Explore streams for 11th & 12th or diploma courses
              </p>
              <div className="mt-6 text-white font-semibold group-hover:translate-x-1 transition">
                Continue →
              </div>
            </button>

            {/* 12th Graduated */}
            <button
              onClick={() => navigate("/class-12")}
              className="group text-left rounded-3xl bg-gradient-to-br from-[#1e293b]/95 to-[#334155]/90 hover:from-[#0f172a]/90 hover:to-[#1e293b]/90 text-white transition shadow-2xl p-8 md:p-10 border border-white/10"
            >
              <div className="w-24 h-24 rounded-2xl grid place-items-center bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white text-5xl mb-6 shadow-lg">
                🎓
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                12th Graduated
              </h3>
              <p className="mt-3 text-white/85 text-base md:text-lg">
                Discover degree programs and career paths
              </p>
              <div className="mt-6 text-white font-semibold group-hover:translate-x-1 transition">
                Continue →
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
