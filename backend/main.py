from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, func
from sqlalchemy.orm import Session
import joblib
import uuid
import os
import scipy.sparse as sp

from database import engine, get_db
from models import ScamAnalysis, CommunityReport, District, JobScamCheck
from schemas import (
    ScamCheckRequest, ScamCheckResponse,
    ReportRequest, ReportResponse,
    DistrictSummary,
    JobCheckRequest, JobCheckResponse
)

# ============================================
# FASTAPI APP
# ============================================
app = FastAPI(title="CyberShurokkha 360 API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# LOAD MODELS
# ============================================

# Scam Detector Model
scam_model = joblib.load("ml_models/scam_classifier.joblib")
scam_vectorizer = joblib.load("ml_models/tfidf_vectorizer.joblib")

# Fake Job Checker Model
JOB_MODEL_PATH = os.path.join(os.path.dirname(__file__), "job_scanner", "fake_job_model.joblib")
JOB_VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "job_scanner", "tfidf_vectorizer.joblib")

job_model = joblib.load(JOB_MODEL_PATH)
job_vectorizer = joblib.load(JOB_VECTORIZER_PATH)

print("✅ All models loaded successfully!")

# ============================================
# HEALTH CHECKS
# ============================================

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

# ============================================
# MODULE 1: SCAM DETECTOR
# ============================================

@app.post("/analyze-scam", response_model=ScamCheckResponse)
def analyze_scam(payload: ScamCheckRequest, db: Session = Depends(get_db)):
    vec = scam_vectorizer.transform([payload.text])

    prediction = scam_model.predict(vec)[0]
    probabilities = scam_model.predict_proba(vec)[0]
    classes = list(scam_model.classes_)
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


# ============================================
# MODULE 3: REPORT A SCAM
# ============================================

@app.post("/reports", response_model=ReportResponse)
def create_report(payload: ReportRequest, db: Session = Depends(get_db)):
    report = CommunityReport(
        id=uuid.uuid4(),
        user_id=None,
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


# ============================================
# MODULE 3: THREAT MAP SUMMARY
# ============================================

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


# ============================================
# MODULE 4: FAKE JOB CHECKER
# ============================================

@app.post("/check-job", response_model=JobCheckResponse)
def check_job(job: JobCheckRequest, db: Session = Depends(get_db)):
    """Analyze job posting for fraud detection"""
    
    full_text = " ".join([
        job.title, job.company_profile, job.description,
        job.requirements, job.benefits
    ]).strip()
    
    if len(full_text) < 10:
        raise HTTPException(
            status_code=400,
            detail="Not enough job posting text provided. Please include at least a title and description."
        )
    
    try:
        text_vec = job_vectorizer.transform([full_text])
        flags = [[job.telecommuting, job.has_company_logo, job.has_questions]]
        combined = sp.hstack([text_vec, flags])
        
        prediction = job_model.predict(combined)[0]
        probability = job_model.predict_proba(combined)[0][1]
        
        risk_score = round(float(probability) * 100, 2)
        is_fake = bool(prediction)
        
        # Risk factors
        risk_factors = []
        text_lower = full_text.lower()
        
        suspicious_patterns = [
            ("no experience", "No experience required for high-paying job"),
            ("urgent", "Urgent/Immediate start requested"),
            ("immediate", "Urgent/Immediate start requested"),
            ("crypto", "Cryptocurrency related - potential scam"),
            ("bitcoin", "Cryptocurrency related - potential scam"),
            ("unlimited earning", "Unrealistic earning claims"),
            ("unlimited potential", "Vague earning claims"),
            ("work from home", "Remote work with suspicious wording"),
            ("transfer", "Mentions financial transactions"),
            ("bank", "Mentions financial transactions"),
            ("no interview", "No interview process mentioned"),
            ("forex", "Forex trading - potential scam"),
            ("investment", "Investment opportunity - potential scam"),
            ("make money fast", "Get rich quick scheme"),
            ("guaranteed", "Guaranteed income claims"),
            ("quick money", "Quick money scheme"),
            ("easy money", "Easy money scheme"),
            ("referral fee", "Request for payment"),
            ("processing fee", "Request for payment"),
            ("visa fee", "Request for payment"),
            ("deposit", "Request for payment"),
            ("wire transfer", "Request for payment"),
        ]
        
        for pattern, factor in suspicious_patterns:
            if pattern in text_lower:
                risk_factors.append(factor)
        
        if len(job.company_profile.strip()) < 20:
            risk_factors.append("Vague or missing company description")
        
        if len(job.requirements.strip()) < 20:
            risk_factors.append("Very short or missing requirements section")
        
        if len(job.benefits.strip()) < 10:
            risk_factors.append("No benefits mentioned - unusual for legitimate jobs")
        
        if len(job.description.strip()) < 50:
            risk_factors.append("Very brief job description")
        
        if text_lower.count('!') > 5:
            risk_factors.append("Excessive use of exclamation marks")
        
        if not job.has_company_logo:
            risk_factors.append("No company logo provided")
        
        if len(risk_factors) == 0 and probability > 0.6:
            risk_factors.append("Patterns consistent with fraudulent job postings")
        
        # Remove duplicates
        seen = set()
        unique_factors = []
        for factor in risk_factors:
            if factor not in seen:
                seen.add(factor)
                unique_factors.append(factor)
        
        risk_factors = unique_factors[:5]
        
        # ===== SAVE TO DATABASE =====
        record = JobScamCheck(
            id=uuid.uuid4(),
            user_id=None,
            job_title=job.title[:200] if job.title else None,
            company_name=job.company_profile[:200] if job.company_profile else None,
            raw_post_text=full_text[:5000],
            requests_advance_payment=any(k in text_lower for k in ["fee", "deposit", "wire", "transfer", "payment"]),
            salary_unrealistic=any(k in text_lower for k in ["unlimited", "guaranteed", "5000", "8000", "10000"]),
            missing_company_info=len(job.company_profile.strip()) < 20,
            urgent_hiring_language=any(k in text_lower for k in ["urgent", "immediate", "hurry"]),
            grammar_quality_score=None,
            risk_score=int(risk_score),
            risk_level="dangerous" if risk_score >= 60 else "medium" if risk_score >= 30 else "safe",
            reasons=risk_factors,
        )
        db.add(record)
        db.commit()
        print(f"✅ Job scan saved to database: {record.id}")
        
        return JobCheckResponse(
            is_fake=is_fake,
            confidence=risk_score,
            probability=float(probability),
            title=job.title[:50] if job.title else "Unknown Job",
            risk_factors=risk_factors,
            status="Complete"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during analysis: {str(e)}"
        )


# ============================================
# STARTUP LOG
# ============================================
print("=" * 50)
print("🚀 CyberShurokkha 360 API Started!")
print("=" * 50)
print("✅ Scam Detector Model: Loaded")
print("✅ Fake Job Checker Model: Loaded")
print("✅ Database: Connected")
print("✅ Endpoints:")
print("   - POST /analyze-scam")
print("   - POST /check-job")
print("   - POST /reports")
print("   - GET  /threat-map/summary")
print("   - GET  /health")
print("   - GET  /db-check")
print("=" * 50)