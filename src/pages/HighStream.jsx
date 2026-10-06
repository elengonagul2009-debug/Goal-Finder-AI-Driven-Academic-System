import { useLocation, useNavigate } from "react-router-dom";

const STREAM_MAP = {
  science: {
    group: "Science with Mathematics (PCM)",
    careers: [
      "Engineering",
      "Architecture",
      "Computer Science",
      "Data Science",
      "Research",
    ],
    higher: ["B.Tech/B.E.", "B.Sc.", "Integrated M.Sc.", "B.Arch"],
    tip: "Build strong fundamentals in mathematics and physics. Practice problem-solving regularly.",
  },
  commerce: {
    group: "Commerce with Mathematics",
    careers: [
      "Chartered Accountant",
      "Company Secretary",
      "Business Analytics",
      "Banking & Finance",
      "Economics",
    ],
    higher: ["B.Com.", "BBA", "Economics (Hons.)", "BMS", "CA/CS/CMA"],
    tip: "Master accounting basics and mental math. Follow markets and read business news daily.",
  },
  arts: {
    group: "Humanities / Arts",
    careers: [
      "Design",
      "Psychology",
      "Law",
      "Journalism",
      "Civil Services",
      "Literature & Linguistics",
    ],
    higher: ["B.A.", "B.Des.", "BBA-LLB", "BJMC", "B.Soc.Sc."],
    tip: "Read widely and write often. Build a portfolio (blogs, designs, short films, etc.).",
  },
};

export default function HighStream() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Fallbacks if user hits URL directly
  const top = state?.result?.top || "science";
  const scores = state?.result?.scores || { science: 0, commerce: 0, arts: 0 };
  const percent = state?.percent ?? "—";
  const board = state?.board ?? "—";

  const data = STREAM_MAP[top];

  return (
    <div
      className="relative min-h-screen w-screen text-white"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />

      <div className="relative z-10 min-h-screen grid grid-rows-[auto,1fr]">
        {/* Top bar */}
        <header className="bg-[#0a1a2f]/95 text-white flex items-center justify-between px-6 md:px-8 py-4 shadow">
          <div className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <div className="bg-teal-500 rounded-lg px-2 py-1">G</div> Goal Finder
          </div>
        </header>

        {/* Main card */}
        <main className="px-4 py-10 grid place-items-center">
          <div className="bg-white text-gray-800 rounded-3xl shadow-2xl w-[92vw] max-w-4xl p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 grid place-items-center mx-auto">
              <span className="text-2xl">🏅</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-center mt-4">
              Your Recommended Path
            </h1>
            <p className="text-center text-gray-500 mt-1">
              Based on your marks and quiz responses
            </p>

            {/* Board and Marks (inside card now) */}
            <div className="flex justify-center mt-4">
              <div className="bg-white border rounded-xl px-6 py-3 shadow-sm flex gap-6 text-sm md:text-base text-gray-800">
                {board !== "—" && (
                  <span className="font-semibold">Board: {board}</span>
                )}
                {percent !== "—" && <span>Marks: {percent}%</span>}
              </div>
            </div>

            {/* Group Recommendation */}
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-teal-700">
                Group Recommendations
              </h2>
              <p className="mt-1 text-gray-700">{data.group}</p>
            </section>

            {/* Two columns */}
            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <span>🔓</span>
                  <span>Career Opportunities</span>
                </div>
                <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                  {data.careers.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border p-5">
                <div className="flex items-center gap-2 font-semibold">
                  <span>🎓</span>
                  <span>Higher Studies</span>
                </div>
                <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                  {data.higher.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Scores mini-cards */}
            <section className="mt-6 grid grid-cols-3 gap-3 text-center">
              {["science", "commerce", "arts"].map((k) => (
                <div key={k} className="rounded-xl border p-4">
                  <div className="text-sm text-gray-500 capitalize">{k}</div>
                  <div className="text-2xl font-bold">{scores[k] ?? 0}</div>
                </div>
              ))}
            </section>

            {/* Tips */}
            <section className="mt-6 rounded-2xl border p-5 bg-gray-50">
              <div className="font-semibold mb-1">Career Tips</div>
              <p className="text-gray-700">{data.tip}</p>
            </section>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border px-4 py-3 hover:bg-gray-50"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl px-4 py-3 bg-teal-600 text-white hover:bg-teal-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}