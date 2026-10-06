import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tenth() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState("");
  const [board, setBoard] = useState("");

  const valid =
    percent !== "" &&
    !Number.isNaN(Number(percent)) &&
    Number(percent) >= 0 &&
    Number(percent) <= 100;

  function onContinue(e) {
    e.preventDefault();
    if (!valid) return;
    // Pass data to next page (optional)
    navigate("/after-10", {
      state: { percent: Number(percent), board: board || null },
    });
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
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

      <div className="relative z-10 h-full grid grid-rows-[auto,1fr]">
        {/* Navbar (same style as others) */}
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
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md hover:bg-white/10"
            >
              Back
            </button>
          </nav>
        </header>

        {/* Content */}
        <main className="h-full overflow-auto px-4 py-8 flex items-start md:items-center justify-center">
          <form
            onSubmit={onContinue}
            className="bg-white text-gray-800 rounded-3xl shadow-2xl w-[92vw] max-w-4xl p-6 md:p-10"
          >
            {/* Inline Back */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-black/80 hover:text-teal-600 -mt-2 mb-4"
              style={{ background: "none", border: "none", outline: "none" }}
            >
              <span className="text-2xl leading-none">←</span>
              <span className="text-base md:text-lg">Back</span>
            </button>

            <h1 className="text-3xl md:text-4xl font-extrabold text-center">
              Enter Your 10th Grade Details
            </h1>

            <div className="mt-8 space-y-6">
              {/* Percentage */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  10th Standard Marks (%)
                </label>
                <input
                  inputMode="decimal"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  placeholder="Enter percentage (e.g., 85)"
                  className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-teal-400 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Value must be between 0 and 100.
                </p>
              </div>

              {/* Board (optional) */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Board Type (Optional)
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-teal-400 outline-none"
                >
                  <option value="">Select Board</option>
                  <option value="State Board">State Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="Matric">Matric</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Continue */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={!valid}
                className="w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-60"
              >
                Continue
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}