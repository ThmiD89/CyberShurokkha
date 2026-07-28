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