// src/pages/ConSchl.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function ConSchl() {
  const navigate = useNavigate();
  const { state } = useLocation(); // carries { percent, board, interests? }

  function startQuiz() {
    // forward the collected info to the quiz page too
    navigate("/quiz", { state });
  }

  return (
    <div className="relative min-h-screen w-screen text-white bg-neutral-200">
      {/* Top nav (same style as other pages) */}
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
            <span className="text-gray-300">🌙</span>
            <select className="bg-transparent outline-none">
              <option>English</option>
              <option>Tamil</option>
            </select>
          </div>
          {/* You can add user name / logout here if needed */}
        </nav>
      </header>

      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered card */}
      <main className="relative z-10 min-h-[calc(100vh-64px)] grid place-items-center px-4">
        <div className="bg-white text-gray-800 w-[92vw] max-w-2xl rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 text-teal-600 grid place-items-center text-2xl">
            🏅
          </div>

          <h1 className="mt-5 text-center text-2xl md:text-3xl font-extrabold text-[#0a1a2f]">
            Academic Interest Quiz
          </h1>

          <p className="mt-3 text-center text-gray-600 leading-relaxed">
            You are going to attend a quiz with <b>10 questions</b> to
            help us recommend the best stream for you.
          </p>

          <button
            onClick={startQuiz}
            className="mt-6 w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition"
          >
            Start Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
