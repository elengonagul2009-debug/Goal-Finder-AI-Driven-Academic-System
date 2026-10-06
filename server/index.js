import express from "express";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import { SOURCES } from "./sources.js";

const app = express();
app.use(cors());
app.get("/", (_req, res) => res.send("Quiz Scraper API running"));

/**
 * Heuristic parsers:
 * - Try to extract MCQ blocks that contain options "A", "B", "C", "D".
 * - If we can't, fallback to True/False items built from question-like lines.
 */
function extractCandidates($) {
  const textBlocks = [];

  // Grab candidates from common containers
  $("li, p, .question, .mcq, .ques, .question-block").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t.length > 20 && /[?]/.test(t)) textBlocks.push(t);
  });

  // Deduplicate
  return Array.from(new Set(textBlocks));
}

function splitMCQ(text) {
  // Try to split options if the block contains them
  // Patterns: (A) (B) (C) (D) or A) B) C) D) or A. B. C. D.
  const optPattern = /\s(?:\(?(A|B|C|D)\)?[)\.:]\s)/gi;
  if (!optPattern.test(text)) return null;

  // Split carefully by option markers
  const parts = text
    .split(/\s(?=\(?A\)?[)\.:]\s)/i)
    .flatMap(part => part.split(/\s(?=\(?B\)?[)\.:]\s)/i))
    .flatMap(part => part.split(/\s(?=\(?C\)?[)\.:]\s)/i))
    .flatMap(part => part.split(/\s(?=\(?D\)?[)\.:]\s)/i))
    .map(s => s.trim());

  if (parts.length < 2) return null;

  // First chunk likely contains question stem; remove leading "A." etc from options
  const stem = parts[0].replace(/\s*\(?[A-D]\)?[)\.:]\s*$/i, "").trim();
  const opts = parts.slice(1).map(s => s.replace(/^\(?[A-D]\)?[)\.:]\s*/, "").trim()).filter(Boolean);

  if (!stem || opts.length < 2) return null;
  return { stem, options: opts.slice(0, 4) }; // cap 4 options
}

function toTrueFalse(stem) {
  // Fallback to True/False if we don't have options
  return {
    stem,
    options: ["True", "False"],
  };
}

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function scrapeFrom(url) {
  try {
    const { data } = await axios.get(url, { timeout: 20000 });
    const $ = cheerio.load(data);
    const cands = extractCandidates($);

    const items = [];
    for (const block of cands) {
      const mcq = splitMCQ(block);
      if (mcq) {
        items.push({ type: "mcq", q: mcq.stem, options: mcq.options });
      } else {
        items.push({ type: "tf", q: block, options: ["True", "False"] });
      }
    }
    return items;
  } catch (e) {
    console.error("Scrape error:", url, e.message);
    return [];
  }
}

// GET /api/questions?board=samacheer|cbse|icse&count=10
app.get("/api/questions", async (req, res) => {
  const board = (req.query.board || "samacheer").toLowerCase();
  const count = Math.max(1, Math.min(20, parseInt(req.query.count || "10", 10)));
  const urls = SOURCES[board] || SOURCES.samacheer;

  // Fetch from multiple sources in parallel, combine, shuffle
  const results = await Promise.all(urls.map(scrapeFrom));
  const combined = shuffle(results.flat());

  // Take the first N unique stems
  const seen = new Set();
  const picked = [];
  for (const item of combined) {
    const key = item.q.slice(0, 200);
    if (!seen.has(key)) {
      seen.add(key);
      picked.push(item);
    }
    if (picked.length >= count) break;
  }

  res.json({
    board,
    count: picked.length,
    items: picked,
    sourceCount: urls.length
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Quiz Scraper API listening on :${PORT}`));
