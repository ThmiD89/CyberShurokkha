"""
Seeds a large, realistic-looking set of community reports across many
Bangladesh districts for demo purposes. Some districts get multiple
reports (hotspots), others get just one or two, so the threat map shows
visible variation in severity instead of one dot per place.

Run from backend/ with the venv active:
    python seed_demo_reports.py

Safe to re-run: it checks for existing rows first and skips if any exist,
so you won't get duplicates. If you want to reseed with more data, delete
existing rows first (see note at the bottom).
"""

from database import SessionLocal
from models import CommunityReport, District
import uuid
import random
from datetime import datetime, timedelta

# (district_name_en, category, description)
demo_reports = [
    # ===== Dhaka — hotspot (biggest city, most scam activity) =====
    ("Dhaka", "phishing", "Received an SMS claiming to be from bKash asking to verify account by clicking a link. Link led to a fake login page."),
    ("Dhaka", "job_scam", "Facebook job post offering 50,000 BDT/month for 'data entry', asked for 2,000 BDT registration fee upfront."),
    ("Dhaka", "sms_fraud", "Text claiming I won a lottery prize of 5 lakh taka, asked to send a processing fee to claim it."),
    ("Dhaka", "qr_fraud", "QR code at a food stall redirected to a fake payment page instead of the vendor's real bKash number."),
    ("Dhaka", "phishing", "Fake Nagad customer support number called asking for my PIN to 'fix' an account issue."),
    ("Dhaka", "investment_scam", "Facebook ad promising 30% monthly returns on a 'crypto investment scheme', asked for an initial deposit."),

    # ===== Chattogram — hotspot (2nd biggest city, port/trade scams) =====
    ("Chattogram", "job_scam", "Recruiter asked for passport copy and 5,000 BDT 'visa processing fee' for a fake overseas job in Malaysia."),
    ("Chattogram", "phishing", "Email pretending to be from a bank asking to 'reactivate' my account with login credentials."),
    ("Chattogram", "sms_fraud", "SMS saying my SIM will be blocked unless I share my NID number and OTP immediately."),
    ("Chattogram", "qr_fraud", "Suspicious QR code shared in a local Facebook marketplace group promising a free mobile recharge."),

    # ===== Sylhet — hotspot (remittance/expat-targeted scams) =====
    ("Sylhet", "sms_fraud", "Text message claiming I won a Grameenphone lottery prize, asked to send a processing fee first."),
    ("Sylhet", "job_scam", "Overseas job agency asked for advance payment for a UK work visa that turned out to be fake."),
    ("Sylhet", "phishing", "WhatsApp message from an unknown number pretending to be a relative abroad, asking for urgent money transfer."),

    # ===== Khulna =====
    ("Khulna", "qr_fraud", "QR code at a local shop redirected to a fake payment gateway instead of the merchant's real bKash number."),
    ("Khulna", "phishing", "Fake 'Rocket' customer care SMS asking to click a link to avoid account suspension."),

    # ===== Rajshahi =====
    ("Rajshahi", "phishing", "Email pretending to be from a bank asking to 'reactivate' account with login credentials."),
    ("Rajshahi", "job_scam", "Job offer for 'online typing work' required paying 1,500 BDT for a 'training kit' before starting."),

    # ===== Rangpur =====
    ("Rangpur", "job_scam", "Job offer for 'online typing work' required paying 1,500 BDT for a 'training kit' before starting."),
    ("Rangpur", "sms_fraud", "SMS claiming a courier package is held at customs, asked to pay a small 'release fee' via link."),

    # ===== Barisal =====
    ("Barisal", "sms_fraud", "SMS saying my SIM will be blocked unless I share my NID and OTP immediately."),

    # ===== Mymensingh =====
    ("Mymensingh", "phishing", "Fake Nagad customer support number called asking for PIN to 'fix' an account issue."),

    # ===== Cumilla =====
    ("Cumilla", "qr_fraud", "Suspicious QR code shared in a Facebook group promising a free mobile recharge."),

    # ===== Narayanganj =====
    ("Narayanganj", "job_scam", "Recruiter asked for passport copy and 5,000 BDT 'visa processing fee' for a fake overseas job."),

    # ===== Gazipur — industrial area, job scams common =====
    ("Gazipur", "job_scam", "Garment factory 'hiring agent' asked for a 1,000 BDT fee to 'confirm' a job interview slot."),
    ("Gazipur", "sms_fraud", "SMS claiming an unpaid electricity bill will cut service today, asked to pay instantly via a link."),

    # ===== Cox's Bazar — tourism-related scams =====
    ("Cox's Bazar", "phishing", "Fake hotel booking website asked for full advance payment via bKash with no confirmation received."),

    # ===== Bogura =====
    ("Bogura", "sms_fraud", "Text claiming to be from the Election Commission asking to 'verify' NID details through a link."),

    # ===== Jashore =====
    ("Jashore", "qr_fraud", "QR code pasted over a legitimate donation box QR at a local mosque, redirecting funds elsewhere."),

    # ===== Dinajpur =====
    ("Dinajpur", "job_scam", "Facebook post for 'freelance data entry' asked new workers to pay for a 'starter software license'."),

    # ===== Noakhali =====
    ("Noakhali", "investment_scam", "Group admin promoted an MLM-style investment scheme promising doubled money within a month."),

    # ===== Faridpur =====
    ("Faridpur", "phishing", "SMS pretending to be from a mobile operator offering a 'free data bundle' via a suspicious link."),

    # ===== Tangail =====
    ("Tangail", "sms_fraud", "Message claiming to be from a courier service asking for a small fee to 'reschedule delivery'."),

    # ===== Pabna =====
    ("Pabna", "job_scam", "Online ad for 'home-based sewing work' required buying a starter kit worth 3,000 BDT."),

    # ===== Kishoreganj =====
    ("Kishoreganj", "qr_fraud", "Fake QR sticker placed over a shop's real payment QR code, redirecting payments to a stranger's account."),
]

def seed():
    db = SessionLocal()
    existing = db.query(CommunityReport).count()
    if existing > 0:
        print(f"Reports table already has {existing} rows — skipping seed to avoid duplicates.")
        print("If you want to reseed with this larger dataset, delete existing rows first (see script comment).")
        db.close()
        return

    inserted = 0
    skipped_districts = []

    for name_en, category, description in demo_reports:
        district = db.query(District).filter(District.name_en == name_en).first()
        if not district:
            skipped_districts.append(name_en)
            continue

        days_ago = random.randint(0, 6)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)

        report = CommunityReport(
            id=uuid.uuid4(),
            user_id=None,
            district_id=district.id,
            category=category,
            description=description,
            status="approved",  # pre-approved so it shows on the public map immediately
            created_at=datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago),
        )
        db.add(report)
        inserted += 1

    db.commit()
    print(f"Seeded {inserted} demo reports across {len(set(r[0] for r in demo_reports))} districts.")
    if skipped_districts:
        print(f"Warning — these district names weren't found and were skipped: {skipped_districts}")
    db.close()

if __name__ == "__main__":
    seed()

# ----------------------------------------------------------------------
# To wipe and reseed (e.g. if you already ran the smaller 10-report
# version and want to replace it with this bigger set), run this in
# psql against your DB first:
#
#   DELETE FROM community_reports;
#
# Then re-run: python seed_demo_reports.py
# ----------------------------------------------------------------------