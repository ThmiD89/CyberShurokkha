from typing import List, Optional
from pydantic import BaseModel

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