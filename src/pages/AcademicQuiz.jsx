import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AcademicQuiz() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const boardRaw = (state?.board || "").toLowerCase();

  const boardKey = useMemo(() => {
    if (boardRaw.includes("cbse")) return "cbse";
    if (boardRaw.includes("icse")) return "icse";
    return "samacheer";
  }, [boardRaw]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    let active = true;
    async function go() {
      setErr("");
      setLoading(true);
      try {
        const r = await fetch(`${API_BASE}/api/questions?board=${boardKey}&count=10`);
        if (!r.ok) throw new Error(`API ${r.status}`);
        const data = await r.json();

        const normalized = (data.items || [])
          .filter((it) => it.q && Array.isArray(it.options) && it.options.length >= 2)
          .map((it) => ({ q: it.q, options: shuffle(it.options).slice(0, 4) }));

        if (active) {
          setDeck(normalized);
          setIdx(0);
          setAnswers([]);
        }
      } catch (e) {
        if (active) setErr(e.message || "Failed to load questions.");
      } finally {
        if (active) setLoading(false);
      }
    }
    go();
    return () => {
      active = false;
    };
  }, [boardKey]);

  const total = deck.length;
  const sel = answers[idx]?.selIndex;

  function selectOption(i) {
    const next = [...answers];
    next[idx] = { selIndex: i };
    setAnswers(next);
  }

  function nextQ() {
    if (idx < total - 1) setIdx((i) => i + 1);
  }

  function prevQ() {
    if (idx > 0) setIdx((i) => i - 1);
  }

  const result = useMemo(() => {
    const scores = { science: 0, commerce: 0, arts: 0 };
    for (let i = 0; i < answers.length; i++) {
      const a = answers[i];
      if (!a) continue;
      const t = deck[i]?.options[a.selIndex] || "";
      const s = String(t).toLowerCase();
      if (/(physics|chem|math|bio|lab|experiment|equation|velocity|current)/.test(s)) scores.science++;
      else if (/(account|business|econom|profit|loss|gst|market|finance)/.test(s)) scores.commerce++;
      else if (/(history|literature|poetry|art|design|sociology|psychology|civics)/.test(s)) scores.arts++;
    }
    if (!scores.science && !scores.commerce && !scores.arts) {
      if (boardKey === "cbse" || boardKey === "samacheer") scores.science = 1;
      if (boardKey === "icse") scores.arts = 1;
    }
    const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    return { scores, top };
  }, [answers, deck, boardKey]);

  const handleSubmit = () => {
    navigate("/highstream", {
      state: { result, percent: state?.percent, board: state?.board, answers },
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black/30 text-white">
        <div className="bg-[#0a1a2f]/90 px-8 py-6 rounded-2xl text-lg font-medium shadow-lg">
          Loading questions…
        </div>
      </div>
    );
  }

  if (err || total === 0) {
    return (
      <div className="min-h-screen grid place-items-center text-white bg-black/40 px-4">
        <div className="bg-[#0a1a2f]/90 p-6 rounded-xl max-w-xl text-center">
          <p className="mb-3">
            Couldn’t load questions for <b>{boardKey}</b>.
          </p>
          <p className="text-sm opacity-80">{err || "No questions found from sources."}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const q = deck[idx];
  const progress = ((idx + 1) / total) * 100;

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
      {/* Subtle background blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative z-10 min-h-screen grid grid-rows-[auto,1fr]">
        {/* Navbar-like header */}
        <header className="bg-[#0a1a2f]/95 text-white flex items-center justify-between px-6 md:px-8 py-4 shadow h-[72px]">
<div className="flex items-center gap-2 text-xl md:text-2xl font-bold">
            <div className="bg-teal-500 rounded-lg px-2 py-1">G</div> Goal Finder
          </div>
        </header>

        {/* Main Quiz Section */}
        <main className="px-4 md:px-10 py-6 md:py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-teal-300 transition mb-6"
            style={{ background: "none", border: "none", outline: "none" }}
          >
            <span className="text-2xl leading-none">←</span>
            <span className="text-lg">Back</span>
          </button>

          {/* Progress bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between text-white/80 text-sm mb-2">
              <span>Progress</span>
              <span>
                {idx + 1}/{total}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#0a1a2f]/95 to-[#1e293b]/95 text-white rounded-3xl shadow-2xl mt-6 p-6 md:p-8 border border-white/10">
            <h2 className="text-xl md:text-2xl font-extrabold mb-4">
              Question {idx + 1}: {q.q}
            </h2>

            {/* Options */}
            <div className="mt-6 space-y-4">
              {q.options.map((option, i) => {
                const letters = ["A", "B", "C", "D"];
                const selected = sel === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={
                      "w-full flex items-center gap-4 text-left rounded-2xl px-4 py-4 transition " +
                      (selected
                        ? "bg-gradient-to-r from-teal-600 to-emerald-500 shadow-lg scale-[1.02]"
                        : "bg-gradient-to-br from-[#0a1a2f]/90 to-[#1e293b]/90 hover:from-[#0f172a]/90 hover:to-[#1e293b]/90")
                    }
                  >
                    <span
                      className={
                        "w-9 h-9 grid place-items-center rounded-full border text-sm font-semibold " +
                        (selected
                          ? "bg-white text-teal-700 border-white"
                          : "bg-transparent text-white border-white/40")
                      }
                    >
                      {letters[i] || i + 1}
                    </span>
                    <span className="text-base md:text-lg">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={prevQ}
                disabled={idx === 0}
                className="px-5 py-2 rounded-lg border border-white/30 text-white/80 hover:bg-white/10 disabled:opacity-40 transition"
              style={{
    background: "none",
    border: "none",
    boxShadow: "none",
    outline: "none",
  }}>
                Back
              </button>

              {idx < total - 1 ? (
                <button
                  onClick={nextQ}
                  disabled={answers[idx] == null}
                  className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
                style={{
    background: "none",
    border: "none",
    boxShadow: "none",
    outline: "none",
  }}>
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answers[idx] == null}
                  className="px-6 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
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
