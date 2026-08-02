from collections import defaultdict
from database import SessionLocal
from models import LogBehaviorRule


# ======================================
# Load Behavior Rules from Database
# ======================================

def load_behavior_rules():
    db = SessionLocal()
    try:
        rows = db.query(LogBehaviorRule).all()
        return [
            {"attack_id": r.attack_id, "attack_name": r.attack_name, "threshold": r.threshold}
            for r in rows
        ]
    finally:
        db.close()


def _get_rule(rules, name, default_threshold):
    for rule in rules:
        if rule["attack_name"] == name:
            return rule["threshold"], rule.get("attack_id")
    return default_threshold, None


# ======================================
# Brute Force Detection
# ======================================
# Works across all three log sources:
#   - Apache/Nginx : repeated POST requests to a login endpoint
#   - Linux        : repeated "Failed password" SSH attempts (Kali & Ubuntu)
#   - Windows      : repeated Event ID 4625 (failed logon) events

def detect_bruteforce(logs):
    rules = load_behavior_rules()
    threshold, attack_id = _get_rule(rules, "Brute Force", 5)

    login_attempts = defaultdict(list)

    for log in logs:
        is_apache_login_attempt = (
            log.get("source_type") == "apache"
            and log.get("method") == "POST"
            and "login" in (log.get("url") or "").lower()
        )
        is_failed_login = log.get("event_type") == "login_failed"

        if is_apache_login_attempt or is_failed_login:
            ip = log.get("ip", "-")
            login_attempts[ip].append(log)

    alerts = []
    for ip, attempts in login_attempts.items():
        if len(attempts) >= threshold:
            sample = attempts[0]
            source_types = sorted({a.get("source_type", "unknown") for a in attempts})
            alerts.append({
                "attack_id": attack_id,
                "attack": "Brute Force",
                "ip": ip,
                "url": sample.get("url") or sample.get("message", "-"),
                "evidence": f"{len(attempts)} failed login attempts ({', '.join(source_types)})",
                "severity": "high",
                "type": "Behavior",
            })

    return alerts


# ======================================
# DoS Detection (Apache/Nginx request floods)
# ======================================

def detect_dos(logs):
    rules = load_behavior_rules()
    threshold, attack_id = _get_rule(rules, "DoS Attack", 100)

    ip_request = defaultdict(int)
    for log in logs:
        if log.get("source_type") == "apache":
            ip_request[log["ip"]] += 1

    alerts = []
    for ip, count in ip_request.items():
        if count >= threshold:
            alerts.append({
                "attack_id": attack_id,
                "attack": "DoS Attack",
                "ip": ip,
                "url": "Multiple URLs",
                "evidence": f"{count} requests",
                "severity": "high",
                "type": "Behavior",
            })

    return alerts


# ======================================
# DDoS Detection (Apache/Nginx, many IPs hitting one URL)
# ======================================

def detect_ddos(logs):
    rules = load_behavior_rules()
    threshold, attack_id = _get_rule(rules, "DDoS Attack", 20)

    url_ips = defaultdict(set)
    for log in logs:
        if log.get("source_type") == "apache" and log.get("url"):
            url_ips[log["url"]].add(log["ip"])

    alerts = []
    for url, ips in url_ips.items():
        if len(ips) >= threshold:
            alerts.append({
                "attack_id": attack_id,
                "attack": "DDoS Attack",
                "ip": "Multiple",
                "url": url,
                "evidence": f"{len(ips)} unique IPs",
                "severity": "critical",
                "type": "Behavior",
            })

    return alerts


# ======================================
# Privilege Escalation Detection (Linux sudo abuse)
# ======================================

def detect_privilege_escalation(logs):
    rules = load_behavior_rules()
    threshold, attack_id = _get_rule(rules, "Privilege Escalation", 10)

    sudo_by_user = defaultdict(int)
    for log in logs:
        if log.get("event_type") == "sudo_command":
            sudo_by_user[log.get("user", "-")] += 1

    alerts = []
    for user, count in sudo_by_user.items():
        if count >= threshold:
            alerts.append({
                "attack_id": attack_id,
                "attack": "Privilege Escalation",
                "ip": "-",
                "url": f'user "{user}"',
                "evidence": f"{count} sudo commands in this log",
                "severity": "medium",
                "type": "Behavior",
            })

    return alerts


# ======================================
# Run All Behavior Detection
# ======================================

def behavior_scan(logs):
    results = []
    results.extend(detect_bruteforce(logs))
    results.extend(detect_dos(logs))
    results.extend(detect_ddos(logs))
    results.extend(detect_privilege_escalation(logs))
    return results