from database import SessionLocal
from models import Lesson, QuizQuestion, UserLessonProgress

def reset():
    db = SessionLocal()

    progress_deleted = db.query(UserLessonProgress).delete()
    quiz_deleted = db.query(QuizQuestion).delete()
    lesson_deleted = db.query(Lesson).delete()

    db.commit()
    db.close()

    print(f"Deleted {progress_deleted} progress rows")
    print(f"Deleted {quiz_deleted} quiz questions")
    print(f"Deleted {lesson_deleted} lessons")
    print("\nDone. LessonTier rows were kept. Now run: python seed_learning_hub_fixed.py")

if __name__ == "__main__":
    reset()