from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime
from fastapi import Form


# ===== SCAM DETECTOR =====
class ScamCheckRequest(BaseModel):
    channel: str
    text: str

class ScamCheckResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: List[str]
    recommendation: str


# ===== FAKE JOB CHECKER =====
class JobCheckRequest(BaseModel):
    title: str = ""
    company_profile: str = ""
    description: str = ""
    requirements: str = ""
    benefits: str = ""
    telecommuting: int = 0
    has_company_logo: int = 0
    has_questions: int = 0

class JobCheckResponse(BaseModel):
    is_fake: bool
    confidence: float
    probability: float
    title: str
    risk_factors: List[str]
    status: str


# ===== REPORT A SCAM =====
class ReportRequest(BaseModel):
    district_id: int
    category: str
    description: str
    screenshot_url: Optional[str] = None
    # attachment handled as file upload separately

class ReportResponse(BaseModel):
    id: str
    district_id: int
    category: str
    description: str
    status: str
    attachment_path: Optional[str] = None


# ===== THREAT MAP =====
class DistrictSummary(BaseModel):
    district_id: int
    name_en: str
    name_bn: str
    centroid_lat: Optional[str] = None
    centroid_lng: Optional[str] = None
    total_reports: int

class ReportListItem(BaseModel):
    id: str
    district_id: int
    district_name_en: str
    district_name_bn: str
    category: str
    description: str
    status: str
    created_at: datetime
    attachment_path: Optional[str] = None


# ===== ADMIN: REPORTS =====
class AdminReportItem(BaseModel):
    id: str
    district_id: int
    district_name_en: str
    district_name_bn: str
    category: str
    description: str
    screenshot_url: Optional[str] = None
    attachment_path: Optional[str] = None
    status: str
    reporter_name: Optional[str] = None
    created_at: datetime

class ReportModerationResponse(BaseModel):
    id: str
    status: str


# ===== LEARNING HUB =====
class TierResponse(BaseModel):
    id: int
    name_en: str
    name_bn: str
    order_index: int
    unlocked: bool
    lessons_completed: int
    lessons_total: int

class LessonSummary(BaseModel):
    id: str
    title: str
    order_index: int
    estimated_minutes: int
    completed: bool

class LessonDetail(BaseModel):
    id: str
    title: str
    content: str
    estimated_minutes: int

class QuizQuestionResponse(BaseModel):
    id: str
    question: str
    options: List[str]

class QuizSubmitRequest(BaseModel):
    lesson_id: str
    answers: Dict[str, int]

class QuizAnswerResult(BaseModel):
    question_id: str
    correct_option_index: int
    is_correct: bool

class QuizSubmitResponse(BaseModel):
    score: int
    total: int
    passed: bool
    lesson_completed: bool
    results: List[QuizAnswerResult]


# ===== AUTH =====

import re
from pydantic import field_validator

class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str
    recaptcha_token: str

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character.")
        return v

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid email address format.")
        return v.lower().strip()

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        if len(v) > 120:
            raise ValueError("Full name is too long.")
        return v

class LoginRequest(BaseModel):
    email: str
    password: str
    recaptcha_token: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    preferred_lang: str
    email_verified: bool


# ===== ADMIN: USERS =====
class AdminUserItem(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    preferred_lang: str
    created_at: datetime

class UserDeleteResponse(BaseModel):
    id: str
    deleted: bool


# ===== MY ACTIVITY =====
class ActivityItem(BaseModel):
    type: str
    title: str
    detail: str
    risk_level: Optional[str] = None
    created_at: datetime

class ActivityStats(BaseModel):
    total_scam_scans: int
    total_url_scans: int
    total_job_checks: int
    total_reports: int
    total_log_scans: int
    dangerous_count: int
    lessons_completed: int

class MyActivityResponse(BaseModel):
    stats: ActivityStats
    items: List[ActivityItem]


# ===== ADMIN: ACTIVITY =====
class AdminActivityItem(BaseModel):
    type: str
    title: str
    detail: str
    risk_level: Optional[str] = None
    user_name: Optional[str] = None
    district_name: Optional[str] = None
    created_at: datetime

class AdminActivityResponse(BaseModel):
    items: List[AdminActivityItem]
    total: int


# ===== LOG SCANNER =====
class LogScanSummary(BaseModel):
    id: str
    original_filename: str
    log_type: str
    total_findings: int
    overall_risk_level: str
    uploaded_at: datetime

class LogFindingSummary(BaseModel):
    id: str
    attack_name: Optional[str] = None
    source_ip: Optional[str] = None
    request_url: Optional[str] = None
    evidence: Optional[str] = None
    severity: Optional[str] = None
    detection_type: Optional[str] = None

class LogScanDetail(BaseModel):
    id: str
    original_filename: str
    log_type: str
    overall_risk_level: str
    uploaded_at: datetime
    findings: List[LogFindingSummary]

class LogSolutionResponse(BaseModel):
    attack_name: str
    severity: str
    fix_description: str
    command: Optional[str] = None


# ===== LIVE FEED =====
class ModuleStats(BaseModel):
    scam_scans: int
    url_scans: int
    log_scans: int
    job_checks: int
    reports: int

class ActivityItemPublic(BaseModel):
    type: str
    module: str
    summary: str
    risk: Optional[str] = None
    timestamp: datetime

class DailyTrendItem(BaseModel):
    date: str
    count: int

class HomepageActivityResponse(BaseModel):
    module_stats: ModuleStats
    recent_activity: List[ActivityItemPublic]
    daily_trend: List[DailyTrendItem]


# ===== CONTACT =====
class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

class ContactResponse(BaseModel):
    status: str
    message: str

class ContactMessageItem(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: datetime
    read: bool
    replied: bool

# schemas.py

class ReportFormData:
    def __init__(
        self,
        district_id: int = Form(...),
        category: str = Form(...),
        description: str = Form(...),
        screenshot_url: Optional[str] = Form(None),
    ):
        self.district_id = district_id
        self.category = category
        self.description = description
        self.screenshot_url = screenshot_url


#Forgot  pass

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

#OTP

class SendOTPRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class VerifyOTPResponse(BaseModel):
    verified: bool
    message: str