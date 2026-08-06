from sqlalchemy import Column, String, Integer, SmallInteger, Boolean, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
from sqlalchemy import Column, String, Integer, SmallInteger, Boolean, Text, TIMESTAMP, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="citizen")
    preferred_lang = Column(String(5), nullable=False, default="bn")
    email_verified = Column(Boolean, default=False)
    phone_number = Column(String(20), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    occupation = Column(String(100), nullable=True)
    terms_accepted = Column(Boolean, nullable=False, default=False)
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
    screenshot_url = Column(Text)  # keep for backward compatibility
    attachment_path = Column(String(500))  # NEW: store file path
    status = Column(String(20), nullable=False, default="pending")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class JobScamCheck(Base):
    __tablename__ = "job_scam_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    job_title = Column(String(200))
    company_name = Column(String(200))
    raw_post_text = Column(Text, nullable=False)
    
    # ===== ADD THESE NEW COLUMNS =====
    requests_advance_payment = Column(Boolean, default=False)
    salary_unrealistic = Column(Boolean, default=False)
    missing_company_info = Column(Boolean, default=False)
    urgent_hiring_language = Column(Boolean, default=False)
    grammar_quality_score = Column(SmallInteger)
    # ================================
    
    risk_score = Column(SmallInteger, nullable=False)
    risk_level = Column(String(20), nullable=False)
    reasons = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class LessonTier(Base):
    __tablename__ = "lesson_tiers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name_en = Column(String(100), nullable=False)
    name_bn = Column(String(100), nullable=False)
    order_index = Column(Integer, nullable=False)
    unlock_requirement = Column(Integer, nullable=False, default=0)  # lessons needed in previous tier


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tier_id = Column(Integer, ForeignKey("lesson_tiers.id"), nullable=False)
    title_en = Column(String(200), nullable=False)
    title_bn = Column(String(200), nullable=False)
    content_en = Column(Text, nullable=False)
    content_bn = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)
    estimated_minutes = Column(Integer, nullable=False, default=5)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False)
    question_en = Column(Text, nullable=False)
    question_bn = Column(Text, nullable=False)
    options_en = Column(JSONB, nullable=False)  # ["option A", "option B", "option C", "option D"]
    options_bn = Column(JSONB, nullable=False)
    correct_option_index = Column(Integer, nullable=False)


class UserLessonProgress(Base):
    __tablename__ = "user_lesson_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, nullable=False, default=False)
    quiz_score = Column(Integer, nullable=True)  # out of 4
    completed_at = Column(TIMESTAMP(timezone=True), nullable=True)

class LogAttack(Base):
    __tablename__ = "log_attacks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    attack_name = Column(String(150), nullable=False, unique=True)
    severity = Column(String(20), nullable=False)


class LogAttackPattern(Base):
    __tablename__ = "log_attack_patterns"

    id = Column(Integer, primary_key=True, autoincrement=True)
    attack_id = Column(Integer, ForeignKey("log_attacks.id", ondelete="CASCADE"), nullable=False)
    pattern = Column(String(255), nullable=False)


class LogBehaviorRule(Base):
    __tablename__ = "log_behavior_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    attack_id = Column(Integer, ForeignKey("log_attacks.id", ondelete="CASCADE"), nullable=False)
    attack_name = Column(String(150), nullable=False)
    threshold = Column(Integer, nullable=False)


class LogSolution(Base):
    __tablename__ = "log_solutions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    attack_id = Column(Integer, ForeignKey("log_attacks.id", ondelete="CASCADE"), nullable=False)
    fix_description = Column(Text, nullable=False)
    command = Column(String(500))


class LogScanSession(Base):
    __tablename__ = "log_scan_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    log_type = Column(String(20), default="unknown")
    total_findings = Column(Integer, nullable=False, default=0)
    dangerous_findings = Column(Integer, nullable=False, default=0)
    overall_risk_level = Column(String(20), nullable=False, default="safe")
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class LogDetectedEvent(Base):
    __tablename__ = "log_detected_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("log_scan_sessions.id", ondelete="CASCADE"), nullable=False)
    attack_id = Column(Integer, ForeignKey("log_attacks.id", ondelete="SET NULL"), nullable=True)
    source_ip = Column(String(100))
    request_url = Column(String(500))
    evidence = Column(String(500))
    severity = Column(String(20))
    detection_type = Column(String(20))
    detected_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    read = Column(Boolean, default=False)
    replied = Column(Boolean, default=False)

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    otp = Column(String(255), nullable=False)  # 6-digit code
    expires_at = Column(DateTime, nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())