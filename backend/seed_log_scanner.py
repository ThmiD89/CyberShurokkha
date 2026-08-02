from database import SessionLocal
from models import LogAttack, LogAttackPattern, LogBehaviorRule, LogSolution

# attack_name -> (severity, [patterns to match in a request URL])
signature_attacks = {
    "SQL Injection": ("critical", ["' OR '1'='1", "UNION SELECT", "DROP TABLE"]),
    "Cross-Site Scripting (XSS)": ("high", ["<script", "onerror="]),
    "Path Traversal": ("high", ["../", "..\\"]),
    "Command Injection": ("critical", [";cat ", "|nc "]),
    "Local File Inclusion": ("high", ["/etc/passwd"]),
}

# attack_name -> (severity, threshold)
behavior_attacks = {
    "Brute Force": ("high", 5),
    "DoS Attack": ("high", 100),
    "DDoS Attack": ("critical", 20),
    "Privilege Escalation": ("medium", 10),
}

# attack_name -> (fix_description, command or None)
solutions = {
    "SQL Injection": (
        "Use parameterized queries / prepared statements instead of building SQL from raw input. "
        "Add input validation and a WAF rule for this pattern.",
        "Review and patch the affected endpoint's query code",
    ),
    "Cross-Site Scripting (XSS)": (
        "Escape/encode all user-supplied output and set a Content-Security-Policy header to block inline scripts.",
        None,
    ),
    "Path Traversal": (
        "Normalize and validate file paths server-side; never build file paths directly from user input.",
        None,
    ),
    "Command Injection": (
        "Never pass user input directly to a shell command. Use safe APIs/libraries instead of shell execution.",
        None,
    ),
    "Local File Inclusion": (
        "Restrict which files the application can include/read, and run the process with least-privilege file access.",
        None,
    ),
    "Brute Force": (
        "Repeated failed logins from one source were detected. Rate-limit login attempts and consider "
        "temporarily blocking the IP.",
        "sudo iptables -A INPUT -s <ip> -j DROP",
    ),
    "DoS Attack": (
        "One IP sent an unusually high volume of requests. Rate-limit or temporarily block the source.",
        "sudo iptables -A INPUT -s <ip> -j DROP",
    ),
    "DDoS Attack": (
        "Many distinct IPs hit the same endpoint in a short window - likely a distributed attack. "
        "Enable rate limiting at the load balancer/CDN level.",
        None,
    ),
    "Privilege Escalation": (
        "A single account ran an unusually high number of sudo commands in this log. Review the command "
        "history for that user and confirm each action was authorized.",
        "sudo grep <username> /var/log/auth.log | grep COMMAND",
    ),
}


def seed():
    db = SessionLocal()
    existing_count = db.query(LogAttack).count()
    if existing_count > 0:
        print(f"log_attacks table already has {existing_count} rows — skipping seed to avoid duplicates.")
        db.close()
        return

    attacks_by_name = {}

    for name, (severity, patterns) in signature_attacks.items():
        attack = LogAttack(attack_name=name, severity=severity)
        db.add(attack)
        db.flush()  # so attack.id is available before commit
        attacks_by_name[name] = attack
        for pattern in patterns:
            db.add(LogAttackPattern(attack_id=attack.id, pattern=pattern))

    for name, (severity, threshold) in behavior_attacks.items():
        attack = LogAttack(attack_name=name, severity=severity)
        db.add(attack)
        db.flush()
        attacks_by_name[name] = attack
        db.add(LogBehaviorRule(attack_id=attack.id, attack_name=name, threshold=threshold))

    for name, (fix_description, command) in solutions.items():
        attack = attacks_by_name[name]
        db.add(LogSolution(attack_id=attack.id, fix_description=fix_description, command=command))

    db.commit()
    print(f"Seeded {len(attacks_by_name)} attack types with patterns/rules/solutions successfully.")
    db.close()


if __name__ == "__main__":
    seed()