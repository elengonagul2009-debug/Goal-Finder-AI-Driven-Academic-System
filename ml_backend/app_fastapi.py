from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import random
from groq import Groq
import os
from dotenv import load_dotenv

# --- Load Environment Variables ---
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# --- Initialize FastAPI App ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# 📘 QUIZ GENERATION ENDPOINT
# ==========================================================

class QuizRequest(BaseModel):
    level: str
    interest: str
    goal: str


@app.post("/api/generate-quiz")
async def generate_quiz(req: QuizRequest):
    """
    Generate quiz questions dynamically using Groq model
    """
    prompt = f"""
    You are an intelligent education assistant.
    Generate 10 multiple-choice quiz questions for a {req.level}-level student 
    who is interested in {req.interest} and wants to become a {req.goal}.
    Each question should have 4 options and specify which option is correct.
    Return the response in strict JSON format like:
    {{
      "items": [
        {{
          "q": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctIndex": 2
        }}
      ]
    }}
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        content = response.choices[0].message.content

        # Try parsing JSON output
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            json_str = content[content.find("{"):content.rfind("}") + 1]
            data = json.loads(json_str)

        random.shuffle(data["items"])
        return data

    except Exception as e:
        return {"error": str(e)}


# ==========================================================
# 🎯 PREDICT STREAM (ML MODEL PLACEHOLDER)
# ==========================================================

class StudentData(BaseModel):
    percentage: float
    maths: float
    science: float
    english: float
    fav_subject: str
    interest: str
    goal: str


@app.post("/predict")
async def predict_stream(data: StudentData):
    """
    Predicts best stream (mock logic for now)
    """
    if data.science > data.maths:
        recommended = "Biology Group"
    elif data.maths > data.science:
        recommended = "Computer Science Group"
    else:
        recommended = "Commerce"

    return {"recommended_group": recommended}


# ==========================================================
# 🧠 SAVE STUDENT DETAILS ENDPOINT
# ==========================================================

@app.post("/save-student")
async def save_student(data: StudentData):
    """
    Save student data into a local JSON file
    """
    try:
        record = data.dict()
        with open("students.json", "a") as f:
            f.write(json.dumps(record) + "\n")
        return {"status": "saved"}
    except Exception as e:
        return {"error": str(e)}


# ==========================================================
# 🔮 NEW: RECOMMEND STREAM (Dynamic Quiz + Marks + Interests)
# ==========================================================

class StreamRequest(BaseModel):
    percentage: float
    interest: str
    goal: str
    answers: list  # list of {isCorrect: bool, selectedIndex: int, ...}


@app.post("/api/recommend-stream")
def recommend_stream(req: StreamRequest):
    """
    Dynamically calculate best stream based on quiz, interests, and goals
    """
    correct_count = sum(1 for a in req.answers if a.get("isCorrect"))
    wrong_count = len(req.answers) - correct_count

    # Initialize scores for all streams
    streams = {
        "bio_maths": 0,
        "bio_cs": 0,
        "cs_maths": 0,
        "commerce": 0,
        "arts": 0
    }

    # --- Interest-based scoring ---
    interest = req.interest.lower()
    goal = req.goal.lower()

    if "bio" in interest:
        streams["bio_maths"] += 3
        streams["bio_cs"] += 2
    if "computer" in interest or "ai" in interest or "coding" in interest:
        streams["cs_maths"] += 4
        streams["bio_cs"] += 1
    if "business" in interest or "commerce" in interest or "finance" in interest:
        streams["commerce"] += 4
    if "art" in interest or "design" in interest or "social" in interest:
        streams["arts"] += 4

    # --- Goal-based scoring ---
    if "doctor" in goal or "medical" in goal:
        streams["bio_maths"] += 5
    if "engineer" in goal or "developer" in goal:
        streams["cs_maths"] += 5
    if "account" in goal or "finance" in goal or "bank" in goal:
        streams["commerce"] += 5
    if "law" in goal or "civil" in goal or "teacher" in goal:
        streams["arts"] += 4

    # --- Quiz performance impact ---
    for k in streams:
        streams[k] += correct_count * 0.6

    # --- Eligibility based on marks ---
    eligible = []
    for key in streams:
        if req.percentage >= 85 and key in ["bio_maths", "cs_maths"]:
            eligible.append(key)
        elif req.percentage >= 75 and key in ["bio_cs", "commerce"]:
            eligible.append(key)
        else:
            eligible.append("arts")

    # --- Ranking ---
    ranked = sorted(streams.items(), key=lambda x: x[1], reverse=True)
    best_key = ranked[0][0]

    # --- Explanation (why recommended) ---
    reason = f"Based on your interest in {req.interest}, goal to become a {req.goal}, and {correct_count} correct quiz answers, the system found {best_key.replace('_', '-').title()} as your best fit."

    return {
        "best": {"key": best_key, "score": streams[best_key], "reason": reason},
        "scores": streams,
        "eligible": list(set(eligible)),
        "totalCorrect": correct_count,
        "totalWrong": wrong_count,
        "ranked": [{"key": k, "score": s} for k, s in ranked],
    }
