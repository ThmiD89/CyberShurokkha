"""
log_parser.py
=====================================
Multi-source log parser for LUMEN.

Supports:
  - Apache / Nginx style access logs        -> source_type = "apache"
  - Linux syslog / auth.log (Kali & Ubuntu   -> source_type = "linux"
    use the same syslog format, so one
    parser covers both distros)
  - Windows Security Event log exports       -> source_type = "windows"
    (Event Viewer -> "Save All Events As..." -> CSV,
     or a plain-text export containing lines like
     "Account Name:" / "Source Network Address:" / "Event ID:")

parse_log(file_path) auto-detects the format and returns a list of
normalized event dicts so the rest of the pipeline (scanner.py,
behavior.py) doesn't need to know which OS the log came from:

{
    "source_type": "apache" | "linux" | "windows",
    "event_type":  "http_request" | "login_failed" | "login_success"
                   | "sudo_command" | "other",
    "ip":      str,           # best-effort, "-" if unknown
    "time":    str,           # raw timestamp as found in the log
    "user":    str,           # username involved, "-" if unknown
    "method":  str | None,    # HTTP method (apache only)
    "url":     str | None,    # HTTP path (apache only)
    "status":  str | None,    # HTTP status code (apache only)
    "message": str,           # human readable summary of the line
    "raw":     str            # original log line
}
"""

import re


# ==========================================
# APACHE / NGINX ACCESS LOG
# ==========================================

APACHE_PATTERN = re.compile(
    r'(?P<ip>\S+) '
    r'\S+ \S+ '
    r'\[(?P<time>.*?)\] '
    r'"(?P<method>\S+) '
    r'(?P<url>.*?) '
    r'HTTP/(?P<http>.*?)" '
    r'(?P<status>\d+) '
    r'(?P<size>\S+)'
)


def _parse_apache_line(line):
    match = APACHE_PATTERN.search(line)
    if not match:
        return None

    data = match.groupdict()

    return {
        "source_type": "apache",
        "event_type": "http_request",
        "ip": data["ip"],
        "time": data["time"],
        "user": "-",
        "method": data["method"],
        "url": data["url"],
        "status": data["status"],
        "message": f'{data["method"]} {data["url"]} -> {data["status"]}',
        "raw": line.strip(),
    }


# ==========================================
# LINUX SYSLOG / AUTH.LOG (Kali & Ubuntu)
# ==========================================
# Both Kali and Ubuntu are Debian based and share the same syslog /
# auth.log line format, e.g.:
#
#   Jul 30 10:15:23 ubuntu sshd[1204]: Failed password for invalid
#       user admin from 192.168.1.50 port 51515 ssh2
#   Jul 30 10:15:31 kali sshd[1204]: Accepted password for nodi
#       from 10.0.0.5 port 22 ssh2
#   Jul 30 10:16:02 kali sudo: nodi : TTY=pts/0 ; PWD=/home/nodi ;
#       USER=root ; COMMAND=/bin/bash

LINUX_SYSLOG_PREFIX = re.compile(
    r'^(?P<time>\w{3}\s+\d{1,2}\s\d{2}:\d{2}:\d{2})\s+'
    r'(?P<host>\S+)\s+(?P<proc>[\w\-/.]+)(\[\d+\])?:\s*(?P<msg>.*)$'
)

LINUX_FAILED_LOGIN = re.compile(
    r'Failed password for (invalid user )?(?P<user>\S+) from (?P<ip>\S+)'
)

LINUX_ACCEPTED_LOGIN = re.compile(
    r'Accepted password for (?P<user>\S+) from (?P<ip>\S+)'
)

LINUX_SUDO = re.compile(
    r'^(?P<user>\S+)\s*:.*COMMAND=(?P<command>.*)$'
)


def _parse_linux_line(line):
    match = LINUX_SYSLOG_PREFIX.match(line.strip())
    if not match:
        return None

    data = match.groupdict()
    msg = data["msg"]

    failed = LINUX_FAILED_LOGIN.search(msg)
    if failed:
        return {
            "source_type": "linux",
            "event_type": "login_failed",
            "ip": failed.group("ip"),
            "time": data["time"],
            "user": failed.group("user"),
            "method": None,
            "url": None,
            "status": None,
            "message": f'Failed SSH login for "{failed.group("user")}" from {failed.group("ip")}',
            "raw": line.strip(),
        }

    accepted = LINUX_ACCEPTED_LOGIN.search(msg)
    if accepted:
        return {
            "source_type": "linux",
            "event_type": "login_success",
            "ip": accepted.group("ip"),
            "time": data["time"],
            "user": accepted.group("user"),
            "method": None,
            "url": None,
            "status": None,
            "message": f'Successful SSH login for "{accepted.group("user")}" from {accepted.group("ip")}',
            "raw": line.strip(),
        }

    if data["proc"].startswith("sudo"):
        sudo = LINUX_SUDO.search(msg)
        if sudo:
            return {
                "source_type": "linux",
                "event_type": "sudo_command",
                "ip": "-",
                "time": data["time"],
                "user": sudo.group("user"),
                "method": None,
                "url": None,
                "status": None,
                "message": f'"{sudo.group("user")}" ran sudo command: {sudo.group("command")}',
                "raw": line.strip(),
            }

    # Any other recognized syslog line (still counts as a linux event,
    # useful context but no specific rule fires on it)
    return {
        "source_type": "linux",
        "event_type": "other",
        "ip": "-",
        "time": data["time"],
        "user": "-",
        "method": None,
        "url": None,
        "status": None,
        "message": msg,
        "raw": line.strip(),
    }


# ==========================================
# WINDOWS SECURITY EVENT LOG (text/CSV export)
# ==========================================
# Windows Event Viewer -> right click "Security" -> Save All Events As
# -> CSV, or a plain-text export. This parser handles two common
# shapes:
#
# 1) CSV export with a header row containing columns such as
#    "Date and Time", "Event Id", "Source", "Task Category", "Message"
#
# 2) Plain-text export where each event is a block of "Key: Value"
#    lines, e.g.:
#       Event ID: 4625
#       Account Name: admin
#       Source Network Address: 192.168.1.50
#       Date and Time: 7/30/2026 10:15:23 AM

WIN_FAILED_LOGON_ID = "4625"
WIN_SUCCESS_LOGON_ID = "4624"

WIN_FIELD = re.compile(r'^(?P<key>[\w \-/]+):\s*(?P<value>.*)$')


def _looks_like_windows(sample_lines):
    joined = "\n".join(sample_lines).lower()
    return (
        "event id" in joined
        or "account name" in joined
        or "source network address" in joined
        or "microsoft-windows-security-auditing" in joined
    )


def _parse_windows_text(file_path):
    """Parse a plain-text or loosely-CSV Windows Security log export
    made of 'Key: Value' style event blocks separated by blank lines
    or repeated 'Event ID' markers."""

    events = []
    current = {}

    def flush(block):
        if not block:
            return None

        event_id = block.get("event id", "")
        user = block.get("account name", "-")
        ip = block.get("source network address", "-")
        time = block.get("date and time", block.get("time", "-"))
        message = block.get("message", "")

        if event_id == WIN_FAILED_LOGON_ID:
            event_type = "login_failed"
            summary = f'Failed Windows logon for "{user}" from {ip}'
        elif event_id == WIN_SUCCESS_LOGON_ID:
            event_type = "login_success"
            summary = f'Successful Windows logon for "{user}" from {ip}'
        else:
            event_type = "other"
            summary = message or f"Windows Event ID {event_id or 'unknown'}"

        return {
            "source_type": "windows",
            "event_type": event_type,
            "ip": ip if ip else "-",
            "time": time,
            "user": user if user else "-",
            "method": None,
            "url": None,
            "status": event_id or None,
            "message": summary,
            "raw": "; ".join(f"{k}: {v}" for k, v in block.items()),
        }

    with open(file_path, "r", errors="ignore") as file:
        for raw_line in file:
            line = raw_line.strip().strip(",")
            if not line:
                if current:
                    parsed = flush(current)
                    if parsed:
                        events.append(parsed)
                    current = {}
                continue

            match = WIN_FIELD.match(line)
            if match:
                key = match.group("key").strip().lower()
                value = match.group("value").strip()
                if key == "event id" and current.get("event id"):
                    # New event block starting without a blank-line separator
                    parsed = flush(current)
                    if parsed:
                        events.append(parsed)
                    current = {}
                current[key] = value

    if current:
        parsed = flush(current)
        if parsed:
            events.append(parsed)

    return events


def _parse_windows_csv(file_path):
    import csv

    events = []

    with open(file_path, "r", errors="ignore", newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            norm = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}

            event_id = norm.get("event id", norm.get("eventid", ""))
            user = norm.get("account name", norm.get("user", "-"))
            ip = norm.get("source network address", norm.get("ip address", "-"))
            time = norm.get("date and time", norm.get("time created", norm.get("date", "-")))
            message = norm.get("message", norm.get("general", ""))

            if event_id == WIN_FAILED_LOGON_ID:
                event_type = "login_failed"
                summary = f'Failed Windows logon for "{user}" from {ip}'
            elif event_id == WIN_SUCCESS_LOGON_ID:
                event_type = "login_success"
                summary = f'Successful Windows logon for "{user}" from {ip}'
            else:
                event_type = "other"
                summary = message or f"Windows Event ID {event_id or 'unknown'}"

            events.append({
                "source_type": "windows",
                "event_type": event_type,
                "ip": ip if ip else "-",
                "time": time,
                "user": user if user else "-",
                "method": None,
                "url": None,
                "status": event_id or None,
                "message": summary,
                "raw": ",".join(f"{k}={v}" for k, v in norm.items()),
            })

    return events


# ==========================================
# FORMAT DETECTION
# ==========================================

def detect_log_type(file_path):
    """Returns 'apache', 'linux', 'windows_csv', 'windows_text', or 'unknown'."""

    with open(file_path, "r", errors="ignore") as file:
        head = [file.readline() for _ in range(15)]
        head = [line for line in head if line.strip()]

    if not head:
        return "unknown"

    # CSV export from Event Viewer usually has a header row with these columns
    first_line_lower = head[0].lower()
    if "event id" in first_line_lower and ("," in head[0]):
        return "windows_csv"

    if _looks_like_windows(head):
        return "windows_text"

    for line in head:
        if APACHE_PATTERN.search(line):
            return "apache"

    for line in head:
        if LINUX_SYSLOG_PREFIX.match(line.strip()):
            return "linux"

    return "unknown"


def parse_log(file_path):
    """Auto-detects the log format and returns a list of normalized
    event dicts (see module docstring)."""

    log_type = detect_log_type(file_path)

    if log_type == "apache":
        logs = []
        with open(file_path, "r", errors="ignore") as file:
            for line in file:
                parsed = _parse_apache_line(line)
                if parsed:
                    logs.append(parsed)
        return logs

    if log_type == "linux":
        logs = []
        with open(file_path, "r", errors="ignore") as file:
            for line in file:
                parsed = _parse_linux_line(line)
                if parsed:
                    logs.append(parsed)
        return logs

    if log_type == "windows_csv":
        return _parse_windows_csv(file_path)

    if log_type == "windows_text":
        return _parse_windows_text(file_path)

    # Unknown format: try apache first (most common), fall back to empty
    logs = []
    with open(file_path, "r", errors="ignore") as file:
        for line in file:
            parsed = _parse_apache_line(line)
            if parsed:
                logs.append(parsed)
    return logs
