from database import SessionLocal
from models import User

EMAIL_TO_PROMOTE = "ezaztahmid@gmail.com"  # <-- change this


def promote():
    db = SessionLocal()
    user = db.query(User).filter(User.email == EMAIL_TO_PROMOTE.lower().strip()).first()

    if not user:
        print(f"No user found with email {EMAIL_TO_PROMOTE}")
        db.close()
        return

    user.role = "admin"
    db.commit()
    print(f"✅ {user.full_name} ({user.email}) is now an admin.")
    db.close()


if __name__ == "__main__":
    promote()