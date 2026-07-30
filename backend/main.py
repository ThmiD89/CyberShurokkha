from fastapi import FastAPI, Depends, HTTPException, File, UploadFile  # Added File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, func
from sqlalchemy.orm import Session
import joblib
import uuid
import os
import sys                     # Added
import scipy.sparse as sp
from urllib.parse import urlparse  # Added

from database import engine, get_db
from models import (
    ScamAnalysis, CommunityReport, District, JobScamCheck,
    LessonTier, Lesson, QuizQuestion, UserLessonProgress,
    UrlScan,                    # Added UrlScan
)
from schemas import (
    ScamCheckRequest, ScamCheckResponse,
    ReportRequest, ReportResponse,
    DistrictSummary,
    JobCheckRequest, JobCheckResponse,
    TierResponse, LessonSummary, LessonDetail,
    QuizQuestionResponse, QuizSubmitRequest, QuizSubmitResponse, QuizAnswerResult,
    ReportListItem,
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
# QR SCANNER IMPORTS (added)
# ============================================
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "qr_scanner"))
from scan_and_check import scan_and_check, looks_like_url
from predict_live import predict_url_uci

# ============================================
# QR SCANNER HELPER FUNCTIONS (added)
# ============================================
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "qr_scanner", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def save_url_scan(db: Session, url: str, risk_score: int, risk_level: str, reasons: list, source_type: str = "direct_url"):
    """Save URL scan result to database."""
    parsed = urlparse(url if url.startswith("http") else "http://" + url)
    domain = parsed.netloc or parsed.path
    uses_https = url.startswith("https://")
    shortened_domains = ["bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "is.gd", "buff.ly", "shorturl.at"]
    is_shortened = any(d in domain for d in shortened_domains)
    login_keywords = ["login", "signin", "secure", "account", "verify", "update", "bank", "payment"]
    has_login_keyword = any(k in url.lower() for k in login_keywords)
    suspicious_tlds = [".tk", ".ml", ".ga", ".cf", ".top", ".xyz", ".club", ".online", ".site"]
    suspicious_tld = any(url.lower().endswith(tld) for tld in suspicious_tlds)

    record = UrlScan(
        id=uuid.uuid4(),
        user_id=None,
        source_type=source_type,
        original_input=url,
        resolved_url=url,
        domain=domain,
        uses_https=uses_https,
        is_shortened=is_shortened,
        has_login_keyword=has_login_keyword,
        suspicious_tld=suspicious_tld,
        risk_score=risk_score,
        risk_level=risk_level,
        reasons=reasons,
    )
    db.add(record)
    db.commit()
    print(f"✅ URL scan saved to database: {record.id}")


# ============================================
# HELPERS (existing)
# ============================================

def get_lang_field(obj, field_base: str, lang: str):
    """Returns obj.<field_base>_en or obj.<field_base>_bn depending on lang, defaulting to bn."""
    suffix = "en" if lang == "en" else "bn"
    return getattr(obj, f"{field_base}_{suffix}")


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


@app.get("/reports", response_model=list[ReportListItem])
def list_reports(district_id: int | None = None, db: Session = Depends(get_db)):
    query = (
        db.query(CommunityReport, District.name_en, District.name_bn)
        .join(District, CommunityReport.district_id == District.id)
        .order_by(CommunityReport.created_at.desc())
    )
    if district_id is not None:
        query = query.filter(CommunityReport.district_id == district_id)

    results = query.all()

    return [
        ReportListItem(
            id=str(report.id),
            district_id=report.district_id,
            district_name_en=name_en,
            district_name_bn=name_bn,
            category=report.category,
            description=report.description,
            status=report.status,
            created_at=report.created_at,
        )
        for report, name_en, name_bn in results
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
# MODULE 5: LEARNING HUB
# ============================================

@app.get("/learn/tiers", response_model=list[TierResponse])
def list_tiers(db: Session = Depends(get_db)):
    tiers = db.query(LessonTier).order_by(LessonTier.order_index).all()
    result = []
    for tier in tiers:
        lessons_in_tier = db.query(Lesson).filter(Lesson.tier_id == tier.id).all()
        # No auth wired into these routes yet, so real per-user progress/unlocking
        # isn't tracked here. Tier 0 (order_index 0) is always shown unlocked;
        # everything else is locked until login + user_lesson_progress is wired in.
        unlocked = tier.order_index == 0
        result.append(TierResponse(
            id=tier.id,
            name_en=tier.name_en,
            name_bn=tier.name_bn,
            order_index=tier.order_index,
            unlocked=unlocked,
            lessons_completed=0,
            lessons_total=len(lessons_in_tier),
        ))
    return result


@app.get("/learn/lessons", response_model=list[LessonSummary])
def list_lessons(tier_id: int, lang: str = "bn", db: Session = Depends(get_db)):
    lessons = db.query(Lesson).filter(Lesson.tier_id == tier_id).order_by(Lesson.order_index).all()
    return [
        LessonSummary(
            id=str(l.id),
            title=get_lang_field(l, "title", lang),
            order_index=l.order_index,
            estimated_minutes=l.estimated_minutes,
            completed=False,  # wire to user_lesson_progress once auth exists
        )
        for l in lessons
    ]


@app.get("/learn/lessons/{lesson_id}", response_model=LessonDetail)
def get_lesson(lesson_id: str, lang: str = "bn", db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return LessonDetail(
        id=str(lesson.id),
        title=get_lang_field(lesson, "title", lang),
        content=get_lang_field(lesson, "content", lang),
        estimated_minutes=lesson.estimated_minutes,
    )


@app.get("/learn/lessons/{lesson_id}/quiz", response_model=list[QuizQuestionResponse])
def get_quiz(lesson_id: str, lang: str = "bn", db: Session = Depends(get_db)):
    questions = db.query(QuizQuestion).filter(QuizQuestion.lesson_id == lesson_id).all()
    return [
        QuizQuestionResponse(
            id=str(q.id),
            question=get_lang_field(q, "question", lang),
            options=q.options_en if lang == "en" else q.options_bn,
        )
        for q in questions
    ]


@app.post("/learn/quiz/submit", response_model=QuizSubmitResponse)
def submit_quiz(payload: QuizSubmitRequest, db: Session = Depends(get_db)):
    questions = db.query(QuizQuestion).filter(QuizQuestion.lesson_id == payload.lesson_id).all()
    total = len(questions)
    score = 0
    results = []

    for q in questions:
        selected = payload.answers.get(str(q.id))
        is_correct = selected is not None and selected == q.correct_option_index
        if is_correct:
            score += 1
        results.append(QuizAnswerResult(
            question_id=str(q.id),
            correct_option_index=q.correct_option_index,
            is_correct=is_correct,
        ))

    passed = score >= 3

    return QuizSubmitResponse(
        score=score,
        total=total,
        passed=passed,
        lesson_completed=passed,
        results=results,
    )


# ============================================
# MODULE 2: QR / URL SCANNER (added)
# ============================================

@app.post("/check_url")
def check_url(payload: dict, db: Session = Depends(get_db)):
    """Check a URL for phishing using the ML model."""
    decoded = (payload.get("url") or "").strip()
    if not decoded:
        raise HTTPException(status_code=400, detail="Missing URL")
    if not looks_like_url(decoded):
        raise HTTPException(status_code=400, detail=f'"{decoded}" does not look like a valid URL')

    result = predict_url_uci(decoded)
    result["decoded_from_qr"] = True
    result["confidence"] = float(result["confidence"])

    if result["verdict"] == "SAFE":
        risk_score = max(0, 100 - int(result["confidence"]))
        risk_level = "safe"
        reasons = [f"URL appears safe (confidence: {result['confidence']}%)"]
    else:
        risk_score = int(result["confidence"])
        risk_level = "dangerous"
        reasons = [f"Phishing detected (confidence: {result['confidence']}%)", "URL matches known phishing patterns"]

    save_url_scan(db, decoded, risk_score, risk_level, reasons, source_type="direct_url")
    return result


@app.post("/upload_qr")
async def upload_qr(qr_image: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a QR code image, decode it, and check the URL for phishing."""
    if not qr_image.filename:
        raise HTTPException(status_code=400, detail="Empty filename")

    path = os.path.join(UPLOAD_FOLDER, qr_image.filename)
    with open(path, "wb") as f:
        f.write(await qr_image.read())

    try:
        result = scan_and_check(path)
        os.remove(path)

        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])

        result["confidence"] = float(result["confidence"])

        if result["verdict"] == "SAFE":
            risk_score = max(0, 100 - int(result["confidence"]))
            risk_level = "safe"
            reasons = [f"URL appears safe (confidence: {result['confidence']}%)"]
        else:
            risk_score = int(result["confidence"])
            risk_level = "dangerous"
            reasons = [f"Phishing detected (confidence: {result['confidence']}%)"]

        save_url_scan(db, result["url"], risk_score, risk_level, reasons, source_type="qr_upload")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
print("   - GET  /learn/tiers")
print("   - GET  /learn/lessons")
print("   - GET  /learn/lessons/{lesson_id}")
print("   - GET  /learn/lessons/{lesson_id}/quiz")
print("   - POST /learn/quiz/submit")
print("   - POST /check_url")          # added
print("   - POST /upload_qr")          # added
print("   - GET  /health")
print("   - GET  /db-check")
print("=" * 50)