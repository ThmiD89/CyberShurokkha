"""
Seeds demo users (or reuses them if they already exist) and adds
realistic activity across every module: scam checks, URL scans, job
checks, log scans, and MULTIPLE community reports (5-7) per user.

This version is additive and safe to re-run — it does NOT delete or
wipe anything. Existing users are reused (not recreated), and new
activity rows are simply added on top of whatever's already there.

Run from backend/ with the venv active:
    python seed_demo_users.py
"""

from database import SessionLocal
from models import (
    User, District, ScamAnalysis, UrlScan, JobScamCheck,
    CommunityReport, LogScanSession, LogDetectedEvent,
    Lesson, UserLessonProgress,
)
from auth import hash_password
import uuid
import random
from datetime import datetime, timedelta

demo_users = [
    # (full_name, email, password, phone_number, district_name_en, occupation)
    ("Rafiq Ahmed", "demo.rafiq@cybershurokkha.com", "Demo@1234", "01712345678", "Dhaka", "Software Engineer"),
    ("Nusrat Jahan", "demo.nusrat@cybershurokkha.com", "Demo@1234", "01812345679", "Chattogram", "Student"),
    ("Kamal Hossain", "demo.kamal@cybershurokkha.com", "Demo@1234", "01912345680", "Sylhet", "Business Owner"),
    ("Fatema Begum", "demo.fatema@cybershurokkha.com", "Demo@1234", "01612345681", "Khulna", "Teacher"),
    ("Shakil Rahman", "demo.shakil@cybershurokkha.com", "Demo@1234", "01512345682", "Rajshahi", "Freelancer"),
    ("Ayesha Siddika", "demo.ayesha@cybershurokkha.com", "Demo@1234", "01312345683", "Rangpur", "Nurse"),
    ("Tanvir Islam", "demo.tanvir@cybershurokkha.com", "Demo@1234", "01412345684", "Barisal", "Bank Officer"),
    ("Sumaiya Akter", "demo.sumaiya@cybershurokkha.com", "Demo@1234", "01912345685", "Mymensingh", "University Student"),
    ("Mahmudul Hasan", "demo.mahmudul@cybershurokkha.com", "Demo@1234", "01812345686", "Cumilla", "Garment Manager"),
    ("Sabrina Khatun", "demo.sabrina@cybershurokkha.com", "Demo@1234", "01712345687", "Narayanganj", "Shop Owner"),
    ("Imran Kabir", "demo.imran@cybershurokkha.com", "Demo@1234", "01612345688", "Gazipur", "Factory Supervisor"),
    ("Ruma Aktar", "demo.ruma@cybershurokkha.com", "Demo@1234", "01512345689", "Cox's Bazar", "Hotel Staff"),
    ("Zahidul Islam", "demo.zahidul@cybershurokkha.com", "Demo@1234", "01312345690", "Bogura", "Farmer"),
    ("Nasrin Sultana", "demo.nasrin@cybershurokkha.com", "Demo@1234", "01412345691", "Jashore", "Government Employee"),
    ("Arifur Rahman", "demo.arifur@cybershurokkha.com", "Demo@1234", "01912345692", "Dinajpur", "Electrician"),
]

# ===== Sample content pools used to build each user's activity =====

scam_texts = [
    ("sms", "Congratulations! You have won a BDT 500,000 prize. Click here to claim now: bit.ly/claim-prize", "dangerous", 92,
     ["Message pattern matches known scam/spam characteristics"],
     "Do not click any links or share personal information. Consider reporting this message."),
    ("sms", "Hi, are we still meeting for lunch tomorrow at 1pm near Gulshan 2?", "safe", 8,
     ["No strong scam indicators detected"],
     "This message appears safe, but always stay alert."),
    ("email", "Your bKash account will be suspended unless you verify immediately at this link.", "dangerous", 88,
     ["Message pattern matches known scam/spam characteristics"],
     "Do not click any links or share personal information. Consider reporting this message."),
    ("whatsapp", "Dear customer, your parcel is held at customs. Pay a small release fee to receive it.", "medium", 55,
     ["Message pattern matches known scam/spam characteristics"],
     "Be cautious and verify the sender before taking any action."),
    ("messenger", "Hey, it's your cousin from abroad, I'm stuck and need you to send money urgently via bKash.", "dangerous", 90,
     ["Message pattern matches known scam/spam characteristics"],
     "Do not click any links or share personal information. Consider reporting this message."),
]

url_samples = [
    ("bit.ly/secure-bkash-verify", "dangerous", 91, True, True,
     ["Phishing detected (confidence: 91.0%)", "URL matches known phishing patterns"]),
    ("https://www.google.com", "safe", 3, False, False,
     ["URL appears safe (confidence: 97.0%)"]),
    ("http://nagad-support-verify.tk/login", "dangerous", 95, True, True,
     ["Phishing detected (confidence: 95.0%)", "URL matches known phishing patterns"]),
    ("https://www.bkash.com", "safe", 5, False, False,
     ["URL appears safe (confidence: 95.0%)"]),
]

job_samples = [
    ("Data Entry - Work From Home", "Unknown Company", "dangerous", 82,
     ["Urgent/Immediate start requested", "Request for payment", "Vague or missing company description"]),
    ("Senior Backend Developer", "Brain Station 23", "safe", 12,
     ["No benefits mentioned - unusual for legitimate jobs"]),
    ("Online Typing Job - Earn 50000/month Guaranteed", "QuickCash Ltd", "dangerous", 85,
     ["Guaranteed income claims", "Request for payment", "Very short or missing requirements section"]),
]

log_filenames = [
    "apache_access_aug2026.log",
    "nginx_error_july2026.log",
    "auth_log_server1.log",
]

report_categories = ["phishing", "sms_fraud", "job_scam", "qr_fraud", "investment_scam"]

report_descriptions = [
    "Received a suspicious message asking to verify account details through an unfamiliar link.",
    "Encountered a job posting demanding an upfront payment before any interview took place.",
    "A QR code at a local shop redirected to a payment page that didn't match the merchant's real account.",
    "Got a call from someone claiming to be from a bank, asking to share OTP over the phone.",
    "Saw a Facebook post promising guaranteed high returns on a quick investment scheme.",
    "Someone impersonated a relative on WhatsApp and asked for urgent money transfer.",
    "Received an SMS claiming a prize was won, asking for a processing fee to release it.",
]


def get_or_create_user(db, full_name, email, password, phone, district_name, occupation):
    """Reuses the user if they already exist; only creates if missing."""
    email = email.lower().strip()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return existing, False

    district = db.query(District).filter(District.name_en == district_name).first()
    if not district:
        print(f"Warning: district '{district_name}' not found, skipping user {email}")
        return None, False

    user = User(
        id=uuid.uuid4(),
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role="citizen",
        preferred_lang="bn",
        email_verified=True,
        phone_number=phone,
        district_id=district.id,
        occupation=occupation,
        terms_accepted=True,
    )
    db.add(user)
    db.flush()
    return user, True


def seed():
    db = SessionLocal()

    new_count = 0
    reused_count = 0
    all_users = []

    # ---------- 1. Get or create each user ----------
    for full_name, email, password, phone, district_name, occupation in demo_users:
        user, was_created = get_or_create_user(db, full_name, email, password, phone, district_name, occupation)
        if not user:
            continue
        all_users.append(user)
        if was_created:
            new_count += 1
        else:
            reused_count += 1

    db.commit()
    print(f"Users: {new_count} newly created, {reused_count} already existed and were reused.")

    # ---------- 2. Add fresh activity for every user (additive, no wiping) ----------
    for user in all_users:
        base_time = datetime.utcnow()

        # --- Scam checks: 2 ---
        for _ in range(2):
            channel, text, risk_level, risk_score, reasons, recommendation = random.choice(scam_texts)
            db.add(ScamAnalysis(
                id=uuid.uuid4(),
                user_id=user.id,
                channel=channel,
                input_text=text,
                detected_lang="en",
                risk_score=risk_score,
                risk_level=risk_level,
                reasons=reasons,
                ai_explanation=None,
                recommendation=recommendation,
                model_used="logistic_regression_tfidf_v1",
                created_at=base_time - timedelta(days=random.randint(0, 6), hours=random.randint(0, 23)),
            ))

        # --- URL scans: 2 ---
        for _ in range(2):
            url, risk_level, risk_score, is_shortened, has_login_kw, reasons = random.choice(url_samples)
            domain = url.replace("https://", "").replace("http://", "").split("/")[0]
            db.add(UrlScan(
                id=uuid.uuid4(),
                user_id=user.id,
                source_type=random.choice(["direct_url", "qr_upload"]),
                original_input=url,
                resolved_url=url,
                domain=domain,
                uses_https=url.startswith("https://"),
                is_shortened=is_shortened,
                has_login_keyword=has_login_kw,
                suspicious_tld=url.endswith(".tk"),
                risk_score=risk_score,
                risk_level=risk_level,
                reasons=reasons,
                created_at=base_time - timedelta(days=random.randint(0, 6), hours=random.randint(0, 23)),
            ))

        # --- Job check: 1 ---
        title, company, risk_level, risk_score, reasons = random.choice(job_samples)
        db.add(JobScamCheck(
            id=uuid.uuid4(),
            user_id=user.id,
            job_title=title,
            company_name=company,
            raw_post_text=f"{title} at {company}. " + " ".join(reasons),
            requests_advance_payment="Request for payment" in reasons,
            salary_unrealistic="Guaranteed income claims" in reasons,
            missing_company_info="Vague or missing company description" in reasons,
            urgent_hiring_language="Urgent/Immediate start requested" in reasons,
            grammar_quality_score=None,
            risk_score=risk_score,
            risk_level=risk_level,
            reasons=reasons,
            created_at=base_time - timedelta(days=random.randint(0, 6), hours=random.randint(0, 23)),
        ))

        # --- Log scan: 1, with a few findings ---
        total_findings = random.randint(1, 6)
        dangerous_findings = random.randint(0, min(2, total_findings))
        overall_risk = "dangerous" if dangerous_findings > 0 else ("medium" if total_findings > 0 else "safe")
        scan = LogScanSession(
            id=uuid.uuid4(),
            user_id=user.id,
            original_filename=random.choice(log_filenames),
            stored_filename=f"{uuid.uuid4()}_{random.choice(log_filenames)}",
            log_type=random.choice(["apache", "nginx", "linux"]),
            total_findings=total_findings,
            dangerous_findings=dangerous_findings,
            overall_risk_level=overall_risk,
            uploaded_at=base_time - timedelta(days=random.randint(0, 6), hours=random.randint(0, 23)),
        )
        db.add(scan)
        db.flush()

        for _ in range(min(total_findings, 3)):
            db.add(LogDetectedEvent(
                id=uuid.uuid4(),
                scan_id=scan.id,
                attack_id=None,
                source_ip=f"192.168.{random.randint(1,254)}.{random.randint(1,254)}",
                request_url="/wp-login.php" if random.random() > 0.5 else "/admin",
                evidence="Multiple failed login attempts detected" if random.random() > 0.5 else "Suspicious query pattern detected",
                severity=random.choice(["low", "medium", "high"]),
                detection_type=random.choice(["signature", "behavior"]),
            ))

        # --- Community reports: 5 to 7 per user (the main ask) ---
        district = db.query(District).filter(District.id == user.district_id).first()
        if district:
            num_reports = random.randint(5, 7)
            for _ in range(num_reports):
                db.add(CommunityReport(
                    id=uuid.uuid4(),
                    user_id=user.id,
                    district_id=district.id,
                    category=random.choice(report_categories),
                    description=random.choice(report_descriptions),
                    status="approved",
                    created_at=base_time - timedelta(days=random.randint(0, 6), hours=random.randint(0, 23), minutes=random.randint(0, 59)),
                ))

        # --- Lesson progress: 1 completed lesson, only if lessons exist ---
        lesson = db.query(Lesson).order_by(Lesson.order_index).first()
        if lesson:
            already_done = db.query(UserLessonProgress).filter(
                UserLessonProgress.user_id == user.id,
                UserLessonProgress.lesson_id == lesson.id,
            ).first()
            if not already_done:
                db.add(UserLessonProgress(
                    id=uuid.uuid4(),
                    user_id=user.id,
                    lesson_id=lesson.id,
                    completed=True,
                    quiz_score=random.randint(3, 4),
                    completed_at=base_time - timedelta(days=random.randint(0, 6)),
                ))

    db.commit()
    print(f"Added fresh activity (scam checks, URL scans, job checks, log scans, 5-7 reports each) for {len(all_users)} users.")
    print("Existing data in the database was left untouched — this run only added new rows.")
    print("\nUse this one to log in live during your demo:")
    print("  Email:    demo.rafiq@cybershurokkha.com")
    print("  Password: Demo@1234")
    print("\n(Every seeded user shares the same password: Demo@1234)")
    db.close()


if __name__ == "__main__":
    seed()