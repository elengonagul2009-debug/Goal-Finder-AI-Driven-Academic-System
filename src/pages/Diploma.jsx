import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const INTERESTS = [
  "Engineering",
  "Agriculture",
  "Creative Design & Media",
  "Medical",
];

export default function Diploma() {
  const navigate = useNavigate();
  const { state } = useLocation(); // carries { percent, board, ... }
  const [interest, setInterest] = useState("");

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
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

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
        <main className="h-full overflow-auto px-4 py-10 grid place-items-center">
          <div className="bg-white text-gray-800 rounded-3xl shadow-2xl w-[92vw] max-w-xl p-8 md:p-10">
            <div className="mx-auto bg-blue-100 text-blue-600 rounded-full w-14 h-14 grid place-items-center text-2xl">
              🏅
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-center mt-4">
              Technical Aptitude Quiz
            </h1>

            <p className="text-center text-gray-600 mt-3">
              Pick your interest area and start a 10-question quiz. We’ll
              recommend the best diploma course for you.
            </p>

            {/* Interest Selector */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              {INTERESTS.map((item) => {
                const active = interest === item;
                return (
                  <button
                    key={item}
                    type="button"
                    style={{
                      background: "none",
                      border: "none",
                      outline: "none",
                    }}
                    onClick={() => setInterest(item)}
                    className={
                      "w-full rounded-xl px-5 py-4 border text-base font-semibold transition " +
                      (active
                        ? "border-[#0a1a2f] bg-[#f1f5f9] text-[#0a1a2f] shadow-inner"
                        : "border-gray-200 hover:bg-gray-50")
                    }
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Start Quiz Button (Matches Navbar Color) */}
            <button
              disabled={!interest}
              onClick={() =>
                navigate("/diploma/quiz", {
                  state: { ...state, quizType: "diploma", interest },
                })
              }
              className="w-full mt-6 rounded-xl py-3 font-semibold text-white
                         bg-gradient-to-r from-[#0a1a2f] to-[#132c46]
                         hover:from-[#132c46] hover:to-[#1b395c]
                         disabled:opacity-60 transition duration-300 shadow-md"
            >
              Start Quiz
            </button>

            {!interest && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Select an interest to continue.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
