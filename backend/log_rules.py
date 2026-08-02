from database import SessionLocal
from models import LogAttack, LogAttackPattern


def load_rules():
    """Returns one row per (attack, pattern) pair — same shape the
    original MySQL version returned, so scanner.py doesn't need to change."""
    db = SessionLocal()
    try:
        rows = (
            db.query(
                LogAttack.id.label("attack_id"),
                LogAttack.attack_name,
                LogAttack.severity,
                LogAttackPattern.pattern,
            )
            .join(LogAttackPattern, LogAttackPattern.attack_id == LogAttack.id)
            .all()
        )
        # convert to plain dicts, matching what the old dictionary-cursor gave you
        return [
            {
                "attack_id": r.attack_id,
                "attack_name": r.attack_name,
                "severity": r.severity,
                "pattern": r.pattern,
            }
            for r in rows
        ]
    finally:
        db.close()