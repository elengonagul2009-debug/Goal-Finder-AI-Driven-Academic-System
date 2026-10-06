// src/pages/DipStream.jsx
import { useLocation, useNavigate } from "react-router-dom";

const COURSES = {
  engineering: {
    title: "Engineering & Technology Diplomas",
    options: [
      "Diploma in Mechanical Engineering",
      "Diploma in Computer Engineering",
      "Diploma in Electrical & Electronics",
      "Diploma in Civil Engineering",
      "Diploma in Mechatronics / AI & Robotics",
    ],
    ladder: "Strong scores? Consider Lateral Entry to B.E./B.Tech after your diploma.",
  },
  agriculture: {
    title: "Agriculture & Allied Diplomas",
    options: [
      "Diploma in Agriculture",
      "Diploma in Horticulture",
      "Diploma in Food Technology",
      "Diploma in Dairy Technology",
      "Diploma in Farm Machinery",
    ],
    ladder: "You can progress to B.Sc. (Agri/Hort/Food Tech) after the diploma.",
  },
  design: {
    title: "Creative Design & Media Diplomas",
    options: [
      "Diploma in Graphic & UI/UX Design",
      "Diploma in Animation & VFX",
      "Diploma in Multimedia / Game Design",
      "Diploma in Fashion Design",
      "Diploma in Interior Design",
    ],
    ladder: "Build a portfolio; top-up into B.Des / B.Sc. (Animation, UI/UX) later.",
  },
  medical: {
    title: "Para-Medical & Health Diplomas",
    options: [
      "Diploma in Medical Lab Technology (DMLT)",
      "Diploma in Radiography / Imaging",
      "Diploma in Pharmacy (D.Pharm)",
      "Diploma in OT/Anesthesia Technology",
      "Diploma in Nursing Assistant",
    ],
    ladder: "After diploma, consider B.Sc. programs (MLT, Radiography, Nursing) or Pharm.D.",
  },
};

function pickBand(percent, score) {
  const p = Number(percent) || 0;
  const s = Number(score) || 0;
  if (p >= 85 && s >= 8) return "excellent";
  if (p >= 70 && s >= 6) return "strong";
  if (p >= 55 && s >= 4) return "moderate";
  return "starter";
}

export default function DipStream() {
  const { state } = useLocation(); // {interest, board, percent, score, answered}
  const navigate = useNavigate();

  const domain =
    /agri/i.test(state?.interest)
      ? "agriculture"
      : /design|media|creative/i.test(state?.interest)
      ? "design"
      : /med/i.test(state?.interest)
      ? "medical"
      : "engineering";

  const bundle = COURSES[domain];
  const band = pickBand(state?.percent, state?.score);

  const noteByBand = {
    excellent: "Fantastic profile — you can target top government polytechnics and trending specializations.",
    strong: "Great fit — consider competitive colleges and keep building fundamentals.",
    moderate:
      "You’re on track — pick a course that motivates you and strengthen basics with bridge courses.",
    starter:
      "Start with a foundation-friendly diploma and focus on improving math/science & English for better progression.",
  }[band];

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
        {/* consistent navbar height */}
        <header className="h-[72px] bg-[#0a1a2f]/95 text-white flex items-center justify-between px-6 md:px-8 shadow">
          <div className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <div className="bg-teal-500 rounded-lg px-2 py-1">G</div>
            Goal Finder
          </div>
          <div className="text-sm opacity-80">
            {state?.board && <span className="mr-4">Board: {state.board}</span>}
            {state?.percent != null && <span>Marks: {state.percent}%</span>}
          </div>
        </header>

        <main className="px-4 py-10 grid place-items-center">
          <div className="bg-white text-gray-800 rounded-3xl shadow-2xl w-[92vw] max-w-4xl p-8 md:p-10">
            <div className="w-14 h-14 rounded-2xl bg-[#0a1a2f0d] text-[#0a1a2f] grid place-items-center mx-auto">
              <span className="text-2xl">🎯</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-center mt-4">
              Recommended Diploma Path
            </h1>
            <p className="text-center text-gray-500 mt-1">
              Interest: <b className="capitalize">{state?.interest || "—"}</b> · Quiz Score:{" "}
              <b>{state?.score ?? 0}/10</b>
            </p>

            <section className="mt-8">
              <h2 className="text-lg font-semibold text-[#0a1a2f]">{bundle.title}</h2>
              <ul className="mt-3 list-disc list-inside text-gray-700 space-y-1">
                {bundle.options.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5">
                <div className="font-semibold mb-1">Why this fits you</div>
                <p className="text-gray-700">{noteByBand}</p>
              </div>
              <div className="rounded-2xl border p-5 bg-gray-50">
                <div className="font-semibold mb-1">Next Steps</div>
                <p className="text-gray-700">{bundle.ladder}</p>
              </div>
            </section>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border px-4 py-3 hover:bg-gray-50"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 rounded-xl px-4 py-3 bg-[#0a1a2f] text-white hover:bg-[#132c46]"
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
