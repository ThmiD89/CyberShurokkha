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