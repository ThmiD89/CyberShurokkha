from typing import List, Optional, Dict
from pydantic import BaseModel
from datetime import datetime

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

class ReportResponse(BaseModel):
    id: str
    district_id: int
    category: str
    description: str
    status: str


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
    answers: Dict[str, int]  # {question_id: selected_option_index}

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
class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    preferred_lang: str
# ===== MY ACTIVITY =====
class ActivityItem(BaseModel):
    type: str  # "scam_scan" | "url_scan" | "job_check" | "report"
    title: str
    detail: str
    risk_level: Optional[str] = None
    created_at: datetime

class ActivityStats(BaseModel):
    total_scam_scans: int
    total_url_scans: int
    total_job_checks: int
    total_reports: int
    dangerous_count: int
    lessons_completed: int

class MyActivityResponse(BaseModel):
    stats: ActivityStats
    items: List[ActivityItem]