from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
import joblib
import uuid

from database import engine, get_db
from models import ScamAnalysis
from schemas import ScamCheckRequest, ScamCheckResponse

app = FastAPI()

model = joblib.load("ml_models/scam_classifier.joblib")
vectorizer = joblib.load("ml_models/tfidf_vectorizer.joblib")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-check")
def db_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "detail": str(e)}


@app.post("/analyze-scam", response_model=ScamCheckResponse)
def analyze_scam(payload: ScamCheckRequest, db: Session = Depends(get_db)):
    vec = vectorizer.transform([payload.text])

    prediction = model.predict(vec)[0]
    probabilities = model.predict_proba(vec)[0]
    classes = list(model.classes_)
    spam_index = classes.index("spam")
    spam_probability = probabilities[spam_index]

    risk_score = int(spam_probability * 100)

    if risk_score >= 70:
        risk_level = "dangerous"
    elif risk_score >= 40:
        risk_level = "medium"
    else:
        risk_level = "safe"

    reasons = []
    if prediction == "spam":
        reasons.append("Message pattern matches known scam/spam characteristics")
    else:
        reasons.append("No strong scam indicators detected")

    recommendation = (
        "Do not click any links or share personal information. Consider reporting this message."
        if risk_level == "dangerous"
        else "Be cautious and verify the sender before taking any action."
        if risk_level == "medium"
        else "This message appears safe, but always stay alert."
    )

    record = ScamAnalysis(
        id=uuid.uuid4(),
        user_id=None,
        channel=payload.channel,
        input_text=payload.text,
        detected_lang="en",
        risk_score=risk_score,
        risk_level=risk_level,
        reasons=reasons,
        ai_explanation=None,
        recommendation=recommendation,
        model_used="logistic_regression_tfidf_v1",
    )
    db.add(record)
    db.commit()

    return ScamCheckResponse(
        risk_score=risk_score,
        risk_level=risk_level,
        reasons=reasons,
        recommendation=recommendation,
    )