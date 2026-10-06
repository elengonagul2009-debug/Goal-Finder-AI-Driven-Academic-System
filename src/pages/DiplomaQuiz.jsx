// src/pages/DiplomaQuiz.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

function shuffle(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

export default function DiplomaQuiz() {
  const { state } = useLocation(); // { quizType:"diploma", interest, board, percent, ... }
  const navigate = useNavigate();

  const interest = (state?.interest || "").toLowerCase();
  const boardRaw = (state?.board || "").toLowerCase();

  // map board into cbse|icse|samacheer (state-board)
  const boardKey = useMemo(() => {
    if (boardRaw.includes("cbse")) return "cbse";
    if (boardRaw.includes("icse")) return "icse";
    return "samacheer";
  }, [boardRaw]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deck, setDeck] = useState([]); // [{q, options, keyHints}]
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);

  // ---- Fetch questions (board + interest). Falls back to local set if API not available.
  useEffect(() => {
    let live = true;

    async function fetchQuestions() {
      setErr("");
      setLoading(true);
      try {
        // If you exposed a backend like /api/diploma-questions?board=...&interest=...&count=10
        const res = await fetch(
          `${API_BASE}/api/diploma-questions?board=${boardKey}&interest=${encodeURIComponent(
            interest || "general"
          )}&count=10`
        );

        if (!res.ok) throw new Error("API unavailable");
        const data = await res.json();

        // expect data.items: [{q, options, keyHints?:['engineering','math'...]}]
        const norm =
          (data.items || [])
            .filter((it) => it.q && Array.isArray(it.options) && it.options.length >= 2)
            .map((it) => ({
              q: it.q,
              options: shuffle(it.options).slice(0, 4),
              keyHints: it.keyHints || [],
            })) ?? [];

        if (!live) return;

        if (norm.length) {
          setDeck(norm);
        } else {
          setDeck(buildFallbackQuestions(boardKey, interest));
        }
        setIdx(0);
        setAnswers([]);
      } catch (_e) {
        if (!live) return;
        setDeck(buildFallbackQuestions(boardKey, interest));
        setErr(""); // silent fallback
      } finally {
        if (!live) return;
        setLoading(false);
      }
    }

    fetchQuestions();
    return () => {
      live = false;
    };
  }, [boardKey, interest]);

  const total = deck.length;
  const q = deck[idx];

  const selectOption = (i) => {
    const copy = [...answers];
    copy[idx] = i;
    setAnswers(copy);
  };

  const next = () => idx < total - 1 && setIdx(idx + 1);
  const back = () => idx > 0 && setIdx(idx - 1);

  // ---- Scoring: give points if selected option's text matches interest domain keywords
  // and lightly bias by board (science tilt for CBSE/state; arts tilt for ICSE), only if unclear.
  const score = useMemo(() => {
    let s = 0;
    const domain = interestDomain(interest); // 'engineering'|'agriculture'|'design'|'medical'

    for (let i = 0; i < deck.length; i++) {
      const selIndex = answers[i];
      if (selIndex == null) continue;
      const text = String(deck[i].options[selIndex]).toLowerCase();

      if (domain === "engineering" && /(math|physics|circuit|logic|program|algorithm|design|cad|mechanics)/.test(text))
        s++;
      if (domain === "agriculture" && /(soil|crop|irrigation|botany|farm|pest|agro|fertilizer)/.test(text)) s++;
      if (domain === "design" && /(design|drawing|media|ui|ux|animation|illustration|color|typography)/.test(text)) s++;
      if (domain === "medical" && /(biology|anatomy|first aid|health|diagnosis|chemistry|biochem|microbio)/.test(text))
        s++;
    }

    // subtle nudge by board only if user barely answered to domain (keeps it fair)
    if (s <= 2) {
      if (boardKey !== "icse" && (domain === "engineering" || domain === "medical")) s += 1;
      if (boardKey === "icse" && domain === "design") s += 1;
    }
    return s; // 0..10
  }, [answers, deck, interest, boardKey]);

  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0;

  const submit = () => {
    navigate("/diploma/result", {
      state: {
        interest,
        board: state?.board,
        percent: state?.percent,
        score,
        answered: answers.filter((a) => a != null).length,
      },
    });
  };

  if (loading) {
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
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
        <div className="relative z-10 h-full grid place-items-center px-4">
          <div className="bg-white/10 px-6 py-4 rounded-xl">Loading questions…</div>
        </div>
      </div>
    );
  }

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
        {/* fixed-height navbar for consistency */}
        <header className="h-[72px] bg-[#0a1a2f]/95 text-white flex items-center justify-between px-6 md:px-8 shadow">
          <div className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <div className="bg-teal-500 rounded-lg px-2 py-1">G</div>
            Goal Finder
          </div>
          <div className="text-sm opacity-80 capitalize">{interest || "diploma quiz"}</div>
        </header>

        <main className="px-4 md:px-10 py-6 md:py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-teal-300 transition mb-6"
            style={{ background: "none", border: "none", outline: "none" }}
            title="Back"
          >
            <span className="text-2xl leading-none">←</span>
            <span className="text-lg">Back</span>
          </button>

          {/* progress */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-white/80 text-sm mb-2">
              <span>Progress</span>
              <span>
                {idx + 1}/{total}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0a1a2f] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* card */}
          <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-3xl shadow-2xl mt-6 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-extrabold">
              Question {idx + 1}: {q?.q}
            </h2>

            <div className="mt-6 space-y-4">
              {q?.options?.map((opt, i) => {
                const selected = answers[idx] === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={
                      "w-full text-left rounded-2xl border px-5 py-4 transition " +
                      (selected
                        ? "bg-[#0a1a2f] text-white border-[#0a1a2f]"
                        : "border-gray-200 hover:bg-gray-50 text-gray-800")
                    }
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={back}
                disabled={idx === 0}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>

              {idx < total - 1 ? (
                <button
                  onClick={next}
                  disabled={answers[idx] == null}
                  className="px-5 py-2 rounded-lg bg-[#0a1a2f] text-white hover:bg-[#132c46] disabled:opacity-60"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={answers[idx] == null}
                  className="px-5 py-2 rounded-lg bg-[#0a1a2f] text-white hover:bg-[#132c46] disabled:opacity-60"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

// turn “engineering / agriculture / creative design & media / medical”
function interestDomain(interest) {
  if (/eng/i.test(interest)) return "engineering";
  if (/agri/i.test(interest)) return "agriculture";
  if (/design|media|creative/i.test(interest)) return "design";
  if (/med|medical|health/i.test(interest)) return "medical";
  return "engineering";
}

// Fallback questions when API isn’t present
function buildFallbackQuestions(boardKey, interest) {
  const domain = interestDomain(interest);

  const stem = {
    engineering: [
      {
        q: "You have to choose a club: which sounds most fun?",
        options: [
          "Robotics club building a line follower",
          "Debate club on current affairs",
          "School choir practice",
          "Eco club gardening",
        ],
      },
      {
        q: "Which task do you enjoy more?",
        options: [
          "Solving physics puzzles",
          "Sketching posters",
          "Reading history articles",
          "Practicing first aid kits",
        ],
      },
      {
        q: "Which tool are you most curious to try?",
        options: ["CAD software", "Photo editor", "Microscope", "Tally/Excel"],
      },
    ],
    agriculture: [
      {
        q: "Which topic would you watch a video about?",
        options: [
          "Modern drip irrigation systems",
          "Newton’s laws of motion",
          "Color theory in poster design",
          "Stock market basics",
        ],
      },
      {
        q: "Pick a mini-project:",
        options: [
          "Soil testing and pH analysis",
          "Build a small circuit",
          "Design a logo for a shop",
          "Write a short story",
        ],
      },
      {
        q: "Which field trip sounds best?",
        options: ["Research farm", "Hydro lab", "News studio", "Courtroom visit"],
      },
    ],
    design: [
      {
        q: "Which assignment do you like?",
        options: [
          "Design a mobile app screen",
          "Derive a physics formula",
          "Dissect a leaf and label parts",
          "Balance a ledger",
        ],
      },
      {
        q: "You must pick a contest:",
        options: ["Poster/Logo design", "Science quiz", "Biology quiz", "Business pitch"],
      },
      {
        q: "Best way to spend an hour?",
        options: ["Sketching interfaces", "Solving equations", "Microscope lab", "Case study on GST"],
      },
    ],
    medical: [
      {
        q: "Which book section pulls you in?",
        options: ["Human anatomy basics", "C programming tips", "Company accounting", "World history"],
      },
      {
        q: "Volunteer activity you’d choose:",
        options: ["First-aid desk at event", "Media/Photography", "Robotics helper", "Debating society"],
      },
      {
        q: "Which lab excites you most?",
        options: ["Biology/chemistry lab", "Electronics lab", "Design studio", "Economics lab"],
      },
    ],
  }[domain];

  // a couple of board-flavor items
  const boardFlavor =
    boardKey === "icse"
      ? [
          { q: "Pick one:", options: ["Essay writing", "Mechanics worksheet", "Organic chemistry", "Spreadsheet"] },
        ]
      : [
          { q: "Pick one:", options: ["Mechanics worksheet", "Organic chemistry", "Essay writing", "Spreadsheet"] },
        ];

  const general = [
    {
      q: "How do you prefer to learn?",
      options: ["Hands-on projects", "Reading & summaries", "Watching demos", "Group discussion"],
    },
    {
      q: "Which environment suits you?",
      options: ["Workshop/Lab", "Studio/Design room", "Clinic/Lab coat", "Office/Bank"],
    },
    {
      q: "Which olympiad would you enter?",
      options: ["Science/Mathematics", "Biology", "Design/Art", "Commerce/Business"],
    },
    {
      q: "What do friends ask your help for?",
      options: ["Tough math", "Bio concepts", "Posters/Slides", "Money/Accounts"],
    },
  ];

  // Make to ~10 items
  const pool = shuffle([...(stem || []), ...boardFlavor, ...general]).slice(0, 10);
  return pool.map((x) => ({ ...x, options: shuffle(x.options) }));
}
