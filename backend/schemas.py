from pydantic import BaseModel
from typing import Optional

class ScamCheckRequest(BaseModel):
    channel: str  # "sms" | "email" | "messenger" | "whatsapp" | "other"
    text: str

class ScamCheckResponse(BaseModel):
    risk_score: int
    risk_level: str
    reasons: list[str]
    recommendation: str

class ReportRequest(BaseModel):
    district_id: int
    category: str  # 'sms_scam' | 'phishing_url' | 'fake_job' | 'qr_scam' | 'social_media_scam' | 'investment_fraud' | 'other'
    description: str
    screenshot_url: Optional[str] = None

class ReportResponse(BaseModel):
    id: str
    district_id: int
    category: str
    description: str
    status: str

class DistrictSummary(BaseModel):
    district_id: int
    name_en: str
    name_bn: str
    centroid_lat: Optional[str]
    centroid_lng: Optional[str]
    total_reports: int