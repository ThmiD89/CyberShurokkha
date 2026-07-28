from sqlalchemy import Column, String, Integer, SmallInteger, Boolean, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid

from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="citizen")
    preferred_lang = Column(String(5), nullable=False, default="bn")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class ScamAnalysis(Base):
    __tablename__ = "scam_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    channel = Column(String(20), nullable=False)
    input_text = Column(Text, nullable=False)
    detected_lang = Column(String(5))
    risk_score = Column(SmallInteger, nullable=False)
    risk_level = Column(String(20), nullable=False)
    reasons = Column(JSONB, nullable=False)
    ai_explanation = Column(Text)
    recommendation = Column(Text)
    model_used = Column(String(60))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name_en = Column(String(60), nullable=False)
    name_bn = Column(String(60), nullable=False)
    division = Column(String(60), nullable=False)
    centroid_lat = Column(String(30))
    centroid_lng = Column(String(30))


class UrlScan(Base):
    __tablename__ = "url_scans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    source_type = Column(String(20), nullable=False)
    original_input = Column(Text, nullable=False)
    resolved_url = Column(Text, nullable=False)
    domain = Column(String(255))
    uses_https = Column(Boolean)
    is_shortened = Column(Boolean)
    has_login_keyword = Column(Boolean)
    suspicious_tld = Column(Boolean)
    risk_score = Column(SmallInteger, nullable=False)
    risk_level = Column(String(20), nullable=False)
    reasons = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class CommunityReport(Base):
    __tablename__ = "community_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=False)
    category = Column(String(30), nullable=False)
    description = Column(Text, nullable=False)
    screenshot_url = Column(Text)
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class JobScamCheck(Base):
    __tablename__ = "job_scam_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    job_title = Column(String(200))
    company_name = Column(String(200))
    raw_post_text = Column(Text, nullable=False)
    risk_score = Column(SmallInteger, nullable=False)
    risk_level = Column(String(20), nullable=False)
    reasons = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())