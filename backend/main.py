from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, func
from sqlalchemy.orm import Session
import joblib
import uuid
import os
import sys
import scipy.sparse as sp
from urllib.parse import urlparse
from log_parser import parse_log, detect_log_type
from log_scanner import scan_logs
from behavior import behavior_scan


from database import engine, get_db
from models import (
    ScamAnalysis, CommunityReport, District, JobScamCheck,
    LessonTier, Lesson, QuizQuestion, UserLessonProgress,
    UrlScan, User,
    LogScanSession, LogDetectedEvent, LogAttack, LogSolution,
    ContactMessage
)
from schemas import (
    ScamCheckRequest, ScamCheckResponse,
    ReportRequest, ReportResponse,
    DistrictSummary,
    JobCheckRequest, JobCheckResponse,
    TierResponse, LessonSummary, LessonDetail,
    QuizQuestionResponse, QuizSubmitRequest, QuizSubmitResponse, QuizAnswerResult,
    ReportListItem,
    SignupRequest, LoginRequest, UserResponse,
    ActivityItem, ActivityStats, MyActivityResponse,
    LogScanSummary, LogFindingSummary, LogScanDetail, LogSolutionResponse,
    AdminReportItem, ReportModerationResponse,
    AdminUserItem, UserDeleteResponse,
    AdminActivityItem, AdminActivityResponse,
    HomepageActivityResponse,
    ModuleStats,
    ActivityItemPublic,
    DailyTrendItem,
    ContactRequest, ContactResponse, ContactMessageItem,
)
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from auth import (
    hash_password, verify_password, set_auth_cookie, clear_auth_cookie,
    get_current_user, get_current_user_optional, get_current_admin,
)

from chat_router import router as chat_router

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

app.include_router(chat_router) 

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


def save_url_scan(db: Session, url: str, risk_score: int, risk_level: str, reasons: list,
                   source_type: str = "direct_url", user_id=None):
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
        user_id=user_id,
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

LOG_UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "log_scanner_uploads")
os.makedirs(LOG_UPLOAD_FOLDER, exist_ok=True)

# severities that count as "dangerous" for the overall scan verdict
_DANGEROUS_SEVERITIES = {"critical", "high"}


def _compute_overall_risk(findings: list) -> tuple[str, int]:
    """Given a list of findings (each with a 'severity' key), returns
    (overall_risk_level, dangerous_count)."""
    dangerous_count = sum(1 for f in findings if f.get("severity", "").lower() in _DANGEROUS_SEVERITIES)
    if dangerous_count > 0:
        return "dangerous", dangerous_count
    if len(findings) > 0:
        return "medium", dangerous_count
    return "safe", dangerous_count

# ============================================
# HELPERS (existing)
# ============================================

def get_lang_field(obj, field_base: str, lang: str):
    """Returns obj.<field_base>_en or obj.<field_base>_bn depending on lang, defaulting to bn."""
    suffix = "en" if lang == "en" else "bn"
    return getattr(obj, f"{field_base}_{suffix}")


# ============================================
# MODULE 0: AUTH
# ============================================

@app.post("/auth/signup", response_model=UserResponse)
def signup(payload: SignupRequest, response: Response, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        role="citizen",
        preferred_lang="bn",
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    set_auth_cookie(response, str(user.id))

    return UserResponse(
        id=str(user.id), full_name=user.full_name, email=user.email,
        role=user.role, preferred_lang=user.preferred_lang,
    )


@app.post("/auth/login", response_model=UserResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    set_auth_cookie(response, str(user.id))

    return UserResponse(
        id=str(user.id), full_name=user.full_name, email=user.email,
        role=user.role, preferred_lang=user.preferred_lang,
    )


@app.post("/auth/logout")
def logout(response: Response):
    clear_auth_cookie(response)
    return {"status": "logged out"}


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id), full_name=current_user.full_name,
        email=current_user.email, role=current_user.role,
        preferred_lang=current_user.preferred_lang,
    )
@app.get("/me/activity", response_model=MyActivityResponse)
def get_my_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scam_scans = (
        db.query(ScamAnalysis)
        .filter(ScamAnalysis.user_id == current_user.id)
        .order_by(ScamAnalysis.created_at.desc())
        .all()
    )
    url_scans = (
        db.query(UrlScan)
        .filter(UrlScan.user_id == current_user.id)
        .order_by(UrlScan.created_at.desc())
        .all()
    )
    job_checks = (
        db.query(JobScamCheck)
        .filter(JobScamCheck.user_id == current_user.id)
        .order_by(JobScamCheck.created_at.desc())
        .all()
    )
    reports = (
        db.query(CommunityReport)
        .filter(CommunityReport.user_id == current_user.id)
        .order_by(CommunityReport.created_at.desc())
        .all()
    )
    lessons_completed = (
        db.query(UserLessonProgress)
        .filter(UserLessonProgress.user_id == current_user.id, UserLessonProgress.completed == True)
        .count()
    )

    items = []
    dangerous_count = 0

    for s in scam_scans:
        if s.risk_level == "dangerous":
            dangerous_count += 1
        items.append(ActivityItem(
            type="scam_scan",
            title=f"Scam check ({s.channel})",
            detail=(s.input_text[:80] + "...") if len(s.input_text) > 80 else s.input_text,
            risk_level=s.risk_level,
            created_at=s.created_at,
        ))

    for u in url_scans:
        if u.risk_level == "dangerous":
            dangerous_count += 1
        items.append(ActivityItem(
            type="url_scan",
            title="URL / QR check",
            detail=u.domain or u.original_input,
            risk_level=u.risk_level,
            created_at=u.created_at,
        ))

    for j in job_checks:
        if j.risk_level == "dangerous":
            dangerous_count += 1
        items.append(ActivityItem(
            type="job_check",
            title="Job posting check",
            detail=j.job_title or "Untitled job posting",
            risk_level=j.risk_level,
            created_at=j.created_at,
        ))

    for r in reports:
        items.append(ActivityItem(
            type="report",
            title=f"Reported: {r.category.replace('_', ' ').title()}",
            detail=(r.description[:80] + "...") if len(r.description) > 80 else r.description,
            risk_level=None,
            created_at=r.created_at,
        ))

    log_scans = (
        db.query(LogScanSession)
        .filter(LogScanSession.user_id == current_user.id)
        .order_by(LogScanSession.uploaded_at.desc())
        .all()
    )

    for l in log_scans:
        if l.overall_risk_level == "dangerous":
            dangerous_count += 1
        items.append(ActivityItem(
            type="log_scan",
            title="Log file scan",
            detail=f"{l.original_filename} ({l.total_findings} finding{'s' if l.total_findings != 1 else ''})",
            risk_level=l.overall_risk_level,
            created_at=l.uploaded_at,
        ))    

    items.sort(key=lambda x: x.created_at, reverse=True)
    items = items[:50]  # cap the feed at the 50 most recent actions

    stats = ActivityStats(
        total_scam_scans=len(scam_scans),
        total_url_scans=len(url_scans),
        total_job_checks=len(job_checks),
        total_reports=len(reports),
        total_log_scans=len(log_scans),
        dangerous_count=dangerous_count,
        lessons_completed=lessons_completed,
    )

    return MyActivityResponse(stats=stats, items=items)

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

@app.get("/platform-stats")
def platform_stats(db: Session = Depends(get_db)):
    """Public aggregate stats across all users, for the homepage."""
    total_scam_scans = db.query(ScamAnalysis).count()
    total_url_scans = db.query(UrlScan).count()
    total_job_checks = db.query(JobScamCheck).count()
    total_log_scans = db.query(LogScanSession).count()
    total_reports = db.query(CommunityReport).count()

    dangerous_count = (
        db.query(ScamAnalysis).filter(ScamAnalysis.risk_level == "dangerous").count()
        + db.query(UrlScan).filter(UrlScan.risk_level == "dangerous").count()
        + db.query(JobScamCheck).filter(JobScamCheck.risk_level == "dangerous").count()
        + db.query(LogScanSession).filter(LogScanSession.overall_risk_level == "dangerous").count()
    )

    total_checks = total_scam_scans + total_url_scans + total_job_checks + total_log_scans

    return {
        "total_checks": total_checks,
        "dangerous_count": dangerous_count,
        "total_reports": total_reports,
    }

@app.get("/homepage-activity", response_model=HomepageActivityResponse)
def homepage_activity(db: Session = Depends(get_db)):
    # 1. Module stats
    scam_scans = db.query(ScamAnalysis).count()
    url_scans = db.query(UrlScan).count()
    log_scans = db.query(LogScanSession).count()
    job_checks = db.query(JobScamCheck).count()
    reports = db.query(CommunityReport).count()

    module_stats = ModuleStats(
        scam_scans=scam_scans,
        url_scans=url_scans,
        log_scans=log_scans,
        job_checks=job_checks,
        reports=reports,
    )

    # 2. Recent activity (union of latest from each table)
    # We'll query each table for the latest 20, merge, sort, take top 20
    scam_activities = db.query(
        ScamAnalysis.created_at,
        ScamAnalysis.risk_level,
        ScamAnalysis.input_text,
        ScamAnalysis.channel,
    ).order_by(ScamAnalysis.created_at.desc()).limit(20).all()

    url_activities = db.query(
        UrlScan.created_at,
        UrlScan.risk_level,
        UrlScan.original_input,
        UrlScan.domain,
    ).order_by(UrlScan.created_at.desc()).limit(20).all()

    log_activities = db.query(
        LogScanSession.uploaded_at.label("created_at"),
        LogScanSession.overall_risk_level.label("risk_level"),
        LogScanSession.original_filename,
    ).order_by(LogScanSession.uploaded_at.desc()).limit(20).all()

    job_activities = db.query(
        JobScamCheck.created_at,
        JobScamCheck.risk_level,
        JobScamCheck.job_title,
    ).order_by(JobScamCheck.created_at.desc()).limit(20).all()

    report_activities = db.query(
        CommunityReport.created_at,
        CommunityReport.category,
        CommunityReport.description,
        CommunityReport.district_id,
    ).order_by(CommunityReport.created_at.desc()).limit(20).all()

    # Build a list of dicts with a common format
    items = []

    for s in scam_activities:
        items.append({
            "type": "scam_scan",
            "module": "Scam Detector",
            "summary": f"SMS/Email check ({s.channel})",
            "risk": s.risk_level,
            "timestamp": s.created_at,
        })

    for u in url_activities:
        items.append({
            "type": "url_scan",
            "module": "URL & QR Scanner",
            "summary": f"URL scan: {u.domain or u.original_input[:40]}",
            "risk": u.risk_level,
            "timestamp": u.created_at,
        })

    for l in log_activities:
        items.append({
            "type": "log_scan",
            "module": "Log Scanner",
            "summary": f"Log file: {l.original_filename}",
            "risk": l.risk_level,
            "timestamp": l.created_at,  # we aliased
        })

    for j in job_activities:
        items.append({
            "type": "job_check",
            "module": "Fraud Job Detection",
            "summary": f"Job posting: {j.job_title[:40] if j.job_title else 'Untitled'}",
            "risk": j.risk_level,
            "timestamp": j.created_at,
        })

    for r in report_activities:
        items.append({
            "type": "report",
            "module": "Community Reports",
            "summary": f"Report in {r.category.replace('_',' ').title()}: {r.description[:60]}",
            "risk": None,  # reports don't have risk
            "timestamp": r.created_at,
        })

    # Sort by timestamp descending and take top 20
    items.sort(key=lambda x: x["timestamp"], reverse=True)
    recent = items[:20]

    # Convert to ActivityItemPublic
    recent_activity = [
        ActivityItemPublic(
            type=item["type"],
            module=item["module"],
            summary=item["summary"],
            risk=item["risk"],
            timestamp=item["timestamp"],
        )
        for item in recent
    ]

    # 3. Daily trend – last 7 days (including today)
    # We'll use raw SQL to union all created_at dates and count per day
    # Since SQLAlchemy ORM doesn't easily UNION different tables, we'll use text()
    # 3. Daily trend – last 7 days using ORM (safe for PostgreSQL)
    from sqlalchemy import union_all, select, func
    from datetime import datetime, timedelta

    scam_union = select(ScamAnalysis.created_at)
    url_union = select(UrlScan.created_at)
    log_union = select(LogScanSession.uploaded_at.label("created_at"))
    job_union = select(JobScamCheck.created_at)
    report_union = select(CommunityReport.created_at)

    all_activity = union_all(scam_union, url_union, log_union, job_union, report_union).subquery()

    seven_days_ago = datetime.utcnow() - timedelta(days=6)
    daily = (
        db.query(
            func.date(all_activity.c.created_at).label("date"),
            func.count().label("count")
        )
        .filter(all_activity.c.created_at >= seven_days_ago)
        .group_by(func.date(all_activity.c.created_at))
        .order_by("date")
        .all()
    )

    # Fill missing days with zero
    today = datetime.utcnow().date()
    all_dates = [(today - timedelta(days=i)).isoformat() for i in range(6, -1, -1)]
    trend_dict = {str(row.date): row.count for row in daily}
    daily_trend = [
        DailyTrendItem(date=d, count=trend_dict.get(d, 0))
        for d in all_dates
    ]

    # If some days are missing, fill with zero (optional)
    # We'll fill for completeness later if needed.

    return HomepageActivityResponse(
        module_stats=module_stats,
        recent_activity=recent_activity,
        daily_trend=daily_trend,
    )    

# ============================================
# MODULE 1: SCAM DETECTOR
# ============================================

@app.post("/analyze-scam", response_model=ScamCheckResponse)
def analyze_scam(
    payload: ScamCheckRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
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
        user_id=current_user.id if current_user else None,
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
def create_report(
    payload: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    report = CommunityReport(
        id=uuid.uuid4(),
        user_id=current_user.id if current_user else None,
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
        .outerjoin(
            CommunityReport,
            (CommunityReport.district_id == District.id) & (CommunityReport.status == "approved"),
        )
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
        .filter(CommunityReport.status == "approved")
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
# ADMIN: REPORT MODERATION
# ============================================

@app.get("/admin/reports/pending", response_model=list[AdminReportItem])
def admin_list_reports(
    status: str = "pending",
    district_id: int | None = None,
    category: str | None = None,
    search: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """List reports for moderation, with filters. Defaults to pending only."""
    query = (
        db.query(CommunityReport, District.name_en, District.name_bn, User.full_name)
        .join(District, CommunityReport.district_id == District.id)
        .outerjoin(User, CommunityReport.user_id == User.id)
    )

    if status != "all":
        query = query.filter(CommunityReport.status == status)
    if district_id is not None:
        query = query.filter(CommunityReport.district_id == district_id)
    if category is not None:
        query = query.filter(CommunityReport.category == category)
    if search:
        query = query.filter(CommunityReport.description.ilike(f"%{search}%"))
    if date_from:
        query = query.filter(CommunityReport.created_at >= date_from)
    if date_to:
        query = query.filter(CommunityReport.created_at <= date_to)

    results = query.order_by(CommunityReport.created_at.desc()).all()

    return [
        AdminReportItem(
            id=str(report.id),
            district_id=report.district_id,
            district_name_en=name_en,
            district_name_bn=name_bn,
            category=report.category,
            description=report.description,
            screenshot_url=report.screenshot_url,
            status=report.status,
            reporter_name=full_name,
            created_at=report.created_at,
        )
        for report, name_en, name_bn, full_name in results
    ]


@app.post("/admin/reports/{report_id}/approve", response_model=ReportModerationResponse)
def approve_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    report = db.query(CommunityReport).filter(CommunityReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "approved"
    db.commit()
    return ReportModerationResponse(id=str(report.id), status=report.status)


@app.post("/admin/reports/{report_id}/reject", response_model=ReportModerationResponse)
def reject_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    report = db.query(CommunityReport).filter(CommunityReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    report.status = "rejected"
    db.commit()
    return ReportModerationResponse(id=str(report.id), status=report.status)

# ============================================
# ADMIN: USER MANAGEMENT
# ============================================

@app.get("/admin/users", response_model=list[AdminUserItem])
def admin_list_users(
    search: str | None = None,
    role: str | None = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """List all users, with optional search (name/email) and role filter."""
    query = db.query(User)

    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )
    if role:
        query = query.filter(User.role == role)

    users = query.order_by(User.created_at.desc()).all()

    return [
        AdminUserItem(
            id=str(u.id),
            full_name=u.full_name,
            email=u.email,
            role=u.role,
            preferred_lang=u.preferred_lang,
            created_at=u.created_at,
        )
        for u in users
    ]


@app.delete("/admin/users/{user_id}", response_model=UserDeleteResponse)
def admin_delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Delete a user. Their past scans/reports stay, with user_id set to NULL
    (shown as 'Deleted User' in the admin activity view)."""
    if str(current_admin.id) == user_id:
        raise HTTPException(status_code=400, detail="You can't delete your own admin account.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return UserDeleteResponse(id=user_id, deleted=True)


# ============================================
# ADMIN: PLATFORM-WIDE ACTIVITY
# ============================================

@app.get("/admin/activity", response_model=AdminActivityResponse)
def admin_activity(
    module: str | None = None,  # scam_scan | url_scan | job_check | report | log_scan
    risk_level: str | None = None,
    search: str | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    user_id: str | None = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """Every user's activity, for the admin dashboard. Same shape as
    /me/activity but across the whole platform, with filters."""

    def user_name_for(uid):
        if not uid:
            return "Deleted User"
        u = db.query(User).filter(User.id == uid).first()
        return u.full_name if u else "Deleted User"

    items = []

    if module is None or module == "scam_scan":
        q = db.query(ScamAnalysis)
        if user_id:
            q = q.filter(ScamAnalysis.user_id == user_id)
        for s in q.all():
            items.append(AdminActivityItem(
                type="scam_scan",
                title=f"Scam check ({s.channel})",
                detail=(s.input_text[:80] + "...") if len(s.input_text) > 80 else s.input_text,
                risk_level=s.risk_level,
                user_name=user_name_for(s.user_id),
                created_at=s.created_at,
            ))

    if module is None or module == "url_scan":
        q = db.query(UrlScan)
        if user_id:
            q = q.filter(UrlScan.user_id == user_id)
        for u in q.all():
            items.append(AdminActivityItem(
                type="url_scan",
                title="URL / QR check",
                detail=u.domain or u.original_input,
                risk_level=u.risk_level,
                user_name=user_name_for(u.user_id),
                created_at=u.created_at,
            ))

    if module is None or module == "job_check":
        q = db.query(JobScamCheck)
        if user_id:
            q = q.filter(JobScamCheck.user_id == user_id)
        for j in q.all():
            items.append(AdminActivityItem(
                type="job_check",
                title="Job posting check",
                detail=j.job_title or "Untitled job posting",
                risk_level=j.risk_level,
                user_name=user_name_for(j.user_id),
                created_at=j.created_at,
            ))

    if module is None or module == "report":
        q = db.query(CommunityReport)
        if user_id:
            q = q.filter(CommunityReport.user_id == user_id)
        for r in q.all():
            items.append(AdminActivityItem(
                type="report",
                title=f"Reported: {r.category.replace('_', ' ').title()} ({r.status})",
                detail=(r.description[:80] + "...") if len(r.description) > 80 else r.description,
                risk_level=None,
                user_name=user_name_for(r.user_id),
                created_at=r.created_at,
            ))

    if module is None or module == "log_scan":
        q = db.query(LogScanSession)
        if user_id:
            q = q.filter(LogScanSession.user_id == user_id)
        for l in q.all():
            items.append(AdminActivityItem(
                type="log_scan",
                title="Log file scan",
                detail=f"{l.original_filename} ({l.total_findings} finding{'s' if l.total_findings != 1 else ''})",
                risk_level=l.overall_risk_level,
                user_name=user_name_for(l.user_id),
                created_at=l.uploaded_at,
            ))

    # apply remaining filters
    if risk_level:
        items = [i for i in items if i.risk_level == risk_level]
    if search:
        search_lower = search.lower()
        items = [
            i for i in items
            if search_lower in i.detail.lower() or (i.user_name and search_lower in i.user_name.lower())
        ]
    if date_from:
        items = [i for i in items if str(i.created_at) >= date_from]
    if date_to:
        items = [i for i in items if str(i.created_at) <= date_to]

    items.sort(key=lambda x: x.created_at, reverse=True)
    total = len(items)
    items = items[:limit]

    return AdminActivityResponse(items=items, total=total)

# ============================================
# ADMIN: Contact
# ============================================

@app.get("/admin/contact-messages", response_model=list[ContactMessageItem])
def list_contact_messages(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    messages = db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
    return [
        ContactMessageItem(
            id=msg.id,
            name=msg.name,
            email=msg.email,
            message=msg.message,
            created_at=msg.created_at,
            read=msg.read,
            replied=msg.replied,
        )
        for msg in messages
    ]

@app.put("/admin/contact-messages/{message_id}/read")
def mark_contact_read(
    message_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(404, "Message not found")
    msg.read = True
    db.commit()
    return {"status": "updated"}

@app.put("/admin/contact-messages/{message_id}/replied")
def mark_contact_replied(
    message_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not msg:
        raise HTTPException(404, "Message not found")
    msg.replied = True
    db.commit()
    return {"status": "updated"}

# ============================================
# MODULE 4: FAKE JOB CHECKER
# ============================================

@app.post("/check-job", response_model=JobCheckResponse)
def check_job(
    job: JobCheckRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
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
            user_id=current_user.id if current_user else None,
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
def list_tiers(
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    tiers = db.query(LessonTier).order_by(LessonTier.order_index).all()
    result = []
    previous_completed = 0  # lessons completed in the tier just before this one

    for tier in tiers:
        lessons_in_tier = db.query(Lesson).filter(Lesson.tier_id == tier.id).all()
        lesson_ids = [l.id for l in lessons_in_tier]

        lessons_completed = 0
        if current_user and lesson_ids:
            lessons_completed = (
                db.query(UserLessonProgress)
                .filter(
                    UserLessonProgress.user_id == current_user.id,
                    UserLessonProgress.lesson_id.in_(lesson_ids),
                    UserLessonProgress.completed == True,
                )
                .count()
            )

        if tier.order_index == 0:
            unlocked = True
        elif not current_user:
            unlocked = False  # anonymous visitors only ever see Tier 0 unlocked
        else:
            unlocked = previous_completed >= tier.unlock_requirement

        result.append(TierResponse(
            id=tier.id,
            name_en=tier.name_en,
            name_bn=tier.name_bn,
            order_index=tier.order_index,
            unlocked=unlocked,
            lessons_completed=lessons_completed,
            lessons_total=len(lessons_in_tier),
        ))

        previous_completed = lessons_completed

    return result


@app.get("/learn/lessons", response_model=list[LessonSummary])
def list_lessons(
    tier_id: int,
    lang: str = "bn",
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    lessons = db.query(Lesson).filter(Lesson.tier_id == tier_id).order_by(Lesson.order_index).all()

    completed_ids = set()
    if current_user:
        completed_rows = (
            db.query(UserLessonProgress.lesson_id)
            .filter(
                UserLessonProgress.user_id == current_user.id,
                UserLessonProgress.completed == True,
            )
            .all()
        )
        completed_ids = {row.lesson_id for row in completed_rows}

    return [
        LessonSummary(
            id=str(l.id),
            title=get_lang_field(l, "title", lang),
            order_index=l.order_index,
            estimated_minutes=l.estimated_minutes,
            completed=l.id in completed_ids,
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
def submit_quiz(
    payload: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
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

    # ===== SAVE PROGRESS TO DATABASE =====
    if current_user and passed:
        # Check if progress record exists
        progress = db.query(UserLessonProgress).filter(
            UserLessonProgress.user_id == current_user.id,
            UserLessonProgress.lesson_id == payload.lesson_id
        ).first()

        if progress:
            # Update existing record
            progress.completed = True
            progress.quiz_score = score
            progress.completed_at = func.now()
        else:
            # Create new record
            progress = UserLessonProgress(
                id=uuid.uuid4(),
                user_id=current_user.id,
                lesson_id=payload.lesson_id,
                completed=True,
                quiz_score=score,
                completed_at=func.now(),
            )
            db.add(progress)
        db.commit()
        print(f"✅ Lesson progress saved for user {current_user.id}, lesson {payload.lesson_id}, score {score}")

    return QuizSubmitResponse(
        score=score,
        total=total,
        passed=passed,
        lesson_completed=passed,
        results=results,
    )


# ============================================
# MODULE 6: Log_Scanner
# ============================================

@app.post("/logs/upload")
async def upload_log(
    log_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Upload a log file, auto-detect its type, run signature + behavior
    detection, save everything, and return the scan results."""

    if not log_file.filename:
        raise HTTPException(status_code=400, detail="Empty filename")

    stored_filename = f"{uuid.uuid4()}_{log_file.filename}"
    path = os.path.join(LOG_UPLOAD_FOLDER, stored_filename)

    with open(path, "wb") as f:
        f.write(await log_file.read())

    try:
        log_type = detect_log_type(path)
        events = parse_log(path)

        findings = []
        findings.extend(scan_logs(events))
        findings.extend(behavior_scan(events))

        overall_risk_level, dangerous_count = _compute_overall_risk(findings)

        scan = LogScanSession(
            id=uuid.uuid4(),
            user_id=current_user.id if current_user else None,
            original_filename=log_file.filename,
            stored_filename=stored_filename,
            log_type=log_type,
            total_findings=len(findings),
            dangerous_findings=dangerous_count,
            overall_risk_level=overall_risk_level,
        )
        db.add(scan)
        db.flush()  # so scan.id is available for the events below

        for finding in findings:
            db.add(LogDetectedEvent(
                id=uuid.uuid4(),
                scan_id=scan.id,
                attack_id=finding.get("attack_id"),
                source_ip=finding.get("ip"),
                request_url=finding.get("url"),
                evidence=finding.get("evidence"),
                severity=(finding.get("severity") or "").lower(),
                detection_type=finding.get("type"),
            ))

        db.commit()
        print(f"✅ Log scan saved to database: {scan.id}")

        return {
            "scan_id": str(scan.id),
            "log_type": log_type,
            "total_findings": len(findings),
            "overall_risk_level": overall_risk_level,
            "findings": findings,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error scanning log: {str(e)}")

@app.get("/logs/scans", response_model=list[LogScanSummary])
def list_log_scans(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """A user's own scan history."""
    scans = (
        db.query(LogScanSession)
        .filter(LogScanSession.user_id == current_user.id)
        .order_by(LogScanSession.uploaded_at.desc())
        .all()
    )
    return [
        LogScanSummary(
            id=str(s.id),
            original_filename=s.original_filename,
            log_type=s.log_type,
            total_findings=s.total_findings,
            overall_risk_level=s.overall_risk_level,
            uploaded_at=s.uploaded_at,
        )
        for s in scans
    ]

@app.get("/logs/scans/{scan_id}", response_model=LogScanDetail)
def get_log_scan(
    scan_id: str,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Findings for one scan (the dashboard page)."""
    scan = db.query(LogScanSession).filter(LogScanSession.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    if scan.user_id and (not current_user or scan.user_id != current_user.id):
        raise HTTPException(status_code=403, detail="You don't have access to this scan")

    findings = (
        db.query(LogDetectedEvent)
        .filter(LogDetectedEvent.scan_id == scan.id)
        .all()
    )

    finding_summaries = []
    for f in findings:
        attack = db.query(LogAttack).filter(LogAttack.id == f.attack_id).first() if f.attack_id else None
        finding_summaries.append(LogFindingSummary(
            id=str(f.id),
            attack_name=attack.attack_name if attack else None,
            source_ip=f.source_ip,
            request_url=f.request_url,
            evidence=f.evidence,
            severity=f.severity,
            detection_type=f.detection_type,
        ))

    return LogScanDetail(
        id=str(scan.id),
        original_filename=scan.original_filename,
        log_type=scan.log_type,
        overall_risk_level=scan.overall_risk_level,
        uploaded_at=scan.uploaded_at,
        findings=finding_summaries,
    )


@app.get("/logs/events/{event_id}", response_model=LogFindingSummary)
def get_log_event(event_id: str, db: Session = Depends(get_db)):
    """Full detail of one finding."""
    event = db.query(LogDetectedEvent).filter(LogDetectedEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Finding not found")

    attack = db.query(LogAttack).filter(LogAttack.id == event.attack_id).first() if event.attack_id else None

    return LogFindingSummary(
        id=str(event.id),
        attack_name=attack.attack_name if attack else None,
        source_ip=event.source_ip,
        request_url=event.request_url,
        evidence=event.evidence,
        severity=event.severity,
        detection_type=event.detection_type,
    )


@app.get("/logs/events/{event_id}/solution", response_model=LogSolutionResponse)
def get_log_solution(event_id: str, db: Session = Depends(get_db)):
    """Remediation text for one finding's attack type."""
    event = db.query(LogDetectedEvent).filter(LogDetectedEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Finding not found")
    if not event.attack_id:
        raise HTTPException(status_code=404, detail="No solution available for this finding")

    attack = db.query(LogAttack).filter(LogAttack.id == event.attack_id).first()
    solution = db.query(LogSolution).filter(LogSolution.attack_id == event.attack_id).first()
    if not attack or not solution:
        raise HTTPException(status_code=404, detail="No solution available for this finding")

    return LogSolutionResponse(
        attack_name=attack.attack_name,
        severity=attack.severity,
        fix_description=solution.fix_description,
        command=solution.command,
    )

# ============================================
# MODULE 2: QR / URL SCANNER (added)
# ============================================

@app.post("/check_url")
def check_url(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
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

    save_url_scan(
        db, decoded, risk_score, risk_level, reasons,
        source_type="direct_url",
        user_id=current_user.id if current_user else None,
    )
    return result


@app.post("/upload_qr")
async def upload_qr(
    qr_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
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

        save_url_scan(
            db, result["url"], risk_score, risk_level, reasons,
            source_type="qr_upload",
            user_id=current_user.id if current_user else None,
        )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Contact
# ============================================

@app.post("/contact", response_model=ContactResponse)
def contact(payload: ContactRequest, db: Session = Depends(get_db)):
    # Store in database
    message = ContactMessage(
        id=str(uuid.uuid4()),
        name=payload.name,
        email=payload.email,
        message=payload.message,
        created_at=func.now(),
    )
    db.add(message)
    db.commit()

    # Optional: Send email notification
    try:
        SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
        SMTP_EMAIL = os.getenv("SMTP_EMAIL")
        SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
        CONTACT_RECIPIENT = os.getenv("CONTACT_RECIPIENT", "support@cybershurokkha.com")

        if SMTP_EMAIL and SMTP_PASSWORD:
            msg = MIMEMultipart()
            msg["From"] = SMTP_EMAIL
            msg["To"] = CONTACT_RECIPIENT
            msg["Reply-To"] = payload.email
            msg["Subject"] = f"New Contact Message from {payload.name}"

            body = f"""
            Name: {payload.name}
            Email: {payload.email}
            
            Message:
            {payload.message}
            """
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
    except Exception as e:
        print(f"Email error: {e}")

    return ContactResponse(status="success", message="Message received")


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
print("   - POST /auth/signup")
print("   - POST /auth/login")
print("   - POST /auth/logout")
print("   - GET  /auth/me")
print("   - GET  /me/activity")
print("   - POST /analyze-scam")
print("   - POST /check-job")
print("   - POST /reports")
print("   - GET  /threat-map/summary")
print("   - GET  /learn/tiers")
print("   - GET  /learn/lessons")
print("   - GET  /learn/lessons/{lesson_id}")
print("   - GET  /learn/lessons/{lesson_id}/quiz")
print("   - POST /learn/quiz/submit")
print("   - POST /check_url")
print("   - POST /upload_qr")
print("   - POST /logs/upload")
print("   - GET  /health")
print("   - GET  /db-check")
print("=" * 50)
