from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session
import joblib
import uuid

from database import engine, get_db
from models import ScamAnalysis
from schemas import ScamCheckRequest, ScamCheckResponse

#app = FastAPI()
app = FastAPI(title="CyberShurokkha 360 API", version="1.0.0")

# Add CORS middleware (allow frontend to call API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # Your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],                       # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],                       # Allow all headers
)

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

from models import CommunityReport, District
from schemas import ReportRequest, ReportResponse, DistrictSummary
from sqlalchemy import func


@app.post("/reports", response_model=ReportResponse)
def create_report(payload: ReportRequest, db: Session = Depends(get_db)):
    report = CommunityReport(
        id=uuid.uuid4(),
        user_id=None,  # anonymous for now
        district_id=payload.district_id,
        category=payload.category,
        description=payload.description,
        screenshot_url=payload.screenshot_url,
        status="pending",
    )
    db.add(report)
    db.commit()

    return ReportResponse(
        id=str(report.id),
        district_id=report.district_id,
        category=report.category,
        description=report.description,
        status=report.status,
    )


@app.get("/threat-map/summary", response_model=list[DistrictSummary])
def threat_map_summary(db: Session = Depends(get_db)):
    results = (
        db.query(
            District.id,
            District.name_en,
            District.name_bn,
            District.centroid_lat,
            District.centroid_lng,
            func.count(CommunityReport.id).label("total_reports"),
        )
        .outerjoin(CommunityReport, CommunityReport.district_id == District.id)
        .group_by(District.id)
        .all()
    )

    return [
        DistrictSummary(
            district_id=r.id,
            name_en=r.name_en,
            name_bn=r.name_bn,
            centroid_lat=r.centroid_lat,
            centroid_lng=r.centroid_lng,
            total_reports=r.total_reports,
        )
        for r in results
    ]