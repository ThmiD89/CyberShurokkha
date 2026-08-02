from log_rules import load_rules
from decoder import decode_url


def scan_logs(logs):
    """Signature-based detection. This works against the request URL,
    so it only fires for log types that actually have one (Apache /
    Nginx access logs). Linux and Windows events are skipped here and
    are instead covered by the behavior-based detectors."""

    rules = load_rules()

    findings = []

    for log in logs:
        url = log.get("url")

        if not url:
            continue

        decoded_url = decode_url(url)

        for rule in rules:
            pattern = rule["pattern"]

            if pattern.lower() in decoded_url.lower():
                findings.append({
                    "attack_id": rule["attack_id"],
                    "attack": rule["attack_name"],
                    "ip": log["ip"],
                    "url": url,
                    "evidence": pattern,
                    "severity": rule["severity"],
                    "type": "Signature",
                })

    return findings