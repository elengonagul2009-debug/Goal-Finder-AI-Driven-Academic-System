// src/pages/DiplomaCourse.jsx
import { useLocation, useNavigate } from "react-router-dom";

const RECS = {
  Engineering: {
    high: [
      "Diploma in Computer Engineering",
      "Diploma in Electronics & Communication",
      "Diploma in Mechanical Engineering",
    ],
    mid: [
      "Diploma in Electrical & Electronics",
      "Diploma in Mechatronics",
      "Diploma in Automobile Engineering",
    ],
    low: [
      "Diploma in Tool & Die Making",
      "Diploma in Production Technology",
      "Diploma in Industrial Safety",
    ],
  },
  Agriculture: {
    high: [
      "Diploma in Agriculture",
      "Diploma in Horticulture",
      "Diploma in Agricultural Engineering",
    ],
    mid: [
      "Diploma in Dairy Technology",
      "Diploma in Food Processing",
      "Diploma in Sericulture",
    ],
    low: [
      "Diploma in Organic Farming",
      "Diploma in Farm Machinery",
      "Diploma in Plantation Technology",
    ],
  },
  "Creative Design & Media": {
    high: [
      "Diploma in Graphic Design",
      "Diploma in UI/UX Design",
      "Diploma in Animation & VFX",
    ],
    mid: [
      "Diploma in Multimedia & Web Design",
      "Diploma in Game Art",
      "Diploma in Motion Graphics",
    ],
    low: [
      "Diploma in Photography",
      "Diploma in Digital Film Making",
      "Diploma in 3D Modeling Basics",
    ],
  },
  Medical: {
    high: [
      "Diploma in Medical Laboratory Technology (DMLT)",
      "Diploma in Radiography & Imaging",
      "Diploma in Operation Theatre Technology",
    ],
    mid: [
      "Diploma in Nursing Assistant",
      "Diploma in Physiotherapy Assistant",
      "Diploma in Optometry",
    ],
    low: [
      "Diploma in Pharmacy Assistant",
      "Diploma in Medical Records",
      "Diploma in Health & Sanitary Inspector",
    ],
  },
};

function tierFromScore(score, total) {
  const pct = (score / total) * 100;
  if (pct >= 75) return "high";
  if (pct >= 45) return "mid";
  return "low";
}

export default function DiplomaCourse() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const score = state?.score ?? 0;
  const total = state?.total ?? 10;
  const interest = state?.interest || "Engineering";

  const tier = tierFromScore(score, total);
  const list = RECS[interest]?.[tier] || [];

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
        {/* Navbar */}
        <header className="bg-[#0a1a2f]/95 text-white flex items-center justify-between px-6 md:px-8 py-4 shadow h-[72px]">
<div className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <div className="bg-teal-500 rounded-lg px-2 py-1">G</div>
            Goal Finder
          </div>
        </header>

        <main className="px-4 md:px-10 py-8 md:py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-teal-300 transition mb-6"
            style={{ background: "none", border: "none", outline: "none" }}
            title="Back"
          >
            <span className="text-2xl leading-none">←</span>
            <span className="text-lg">Back</span>
          </button>

          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold">
                Recommended Diploma Courses
              </h1>
              <p className="mt-2 text-white/85">
                Interest: <b>{interest}</b> • Score: <b>{score}</b> / {total} ({Math.round((score/total)*100)}%)
              </p>
              <p className="mt-1 text-white/70">
                Based on your quiz, we think these courses are a great match for you.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {list.map((course) => (
                <div
                  key={course}
                  className="bg-white text-gray-800 rounded-2xl p-6 shadow-xl border border-white/30"
                >
                  <h3 className="text-lg font-extrabold">{course}</h3>
                  <p className="mt-2 text-gray-600 text-sm">
                    Ideal for students interested in <b>{interest}</b>. Explore syllabus,
                    labs, internships and placement records from colleges near you.
                  </p>
                  <button
                    onClick={() => navigate("/colleges", { state: { course, interest } })}
                    className="mt-4 w-full rounded-lg bg-teal-600 text-white py-2 hover:bg-teal-700"
                  >
                    View Colleges
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/diploma/quiz", { state: { ...state } })}
                className="flex-1 rounded-lg border border-white/40 px-4 py-3 hover:bg-white/10"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate("/academic")}
                className="flex-1 rounded-lg bg-white/15 px-4 py-3 hover:bg-white/25"
              >
                Back to Academic Level
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
