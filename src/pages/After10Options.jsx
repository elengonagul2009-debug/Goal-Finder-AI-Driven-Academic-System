// src/pages/After10Options.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function After10Options() {
  const navigate = useNavigate();
  const { state } = useLocation(); // { percent, board, interests? }

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
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/40 to-emerald-900/30 backdrop-blur-sm" />

      {/* Layout */}
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
          </nav>
        </header>

        {/* Content */}
        <main className="h-full overflow-auto px-4 md:px-10 py-6 md:py-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-teal-300 transition mb-8"
            style={{ background: "none", border: "none", outline: "none" }}
            title="Back"
          >
            <span className="text-2xl leading-none">←</span>
            <span className="text-lg">Back</span>
          </button>

          {/* Title */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              What do you prefer after 10th?
            </h1>
            <p className="mt-3 md:mt-4 text-white/80 text-base md:text-lg">
              Recommendations are based on your 10th marks and a short quiz.
            </p>
          </div>

          {/* Option Cards */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Continue School */}
            <button
              onClick={() => navigate("/class-10/continue-school", { state })}
              className="group text-center rounded-3xl bg-gradient-to-br from-[#1e293b]/95 to-[#334155]/90 hover:from-[#0f172a]/90 hover:to-[#1e293b]/90 text-white transition shadow-2xl p-10 backdrop-blur-md border border-white/10"
            >
              <div className="mx-auto w-24 h-24 rounded-2xl grid place-items-center bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-5xl mb-6 shadow-lg">
                📖
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                Continue School
              </h3>
              <p className="mt-1 text-white/80">11th & 12th Grade</p>
              <p className="mt-4 text-white/70">
                Explore academic streams like Science, Commerce, or Arts
              </p>
            </button>

            {/* Diploma Course */}
            <button
              onClick={() => navigate("/class-10/diploma", { state })}
              className="group text-center rounded-3xl bg-gradient-to-br from-[#1e293b]/95 to-[#334155]/90 hover:from-[#0f172a]/90 hover:to-[#1e293b]/90 text-white transition shadow-2xl p-10 backdrop-blur-md border border-white/10"
            >
              <div className="mx-auto w-24 h-24 rounded-2xl grid place-items-center bg-gradient-to-br from-orange-400 to-amber-500 text-white text-5xl mb-6 shadow-lg">
                🏅
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                Diploma Course
              </h3>
              <p className="mt-1 text-white/80">Polytechnic/Diploma</p>
              <p className="mt-4 text-white/70">
                Start technical education and gain job-ready skills
              </p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
