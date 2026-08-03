"""
chat_router.py

Platform-wide chatbot for CyberShurokkha 360, powered by Google Gemini
(free tier). Same /chat endpoint for both the user widget and admin widget —
the tool set sent to Gemini is scoped by current_user.role, so a citizen's
request never even includes admin tools.
"""

import os
import json
from typing import Literal, Optional

from google import genai
from google.genai import types
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import User, CommunityReport, District, LessonTier, Lesson
from auth import get_current_user

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-flash-latest"

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatAction(BaseModel):
    type: Literal["navigate"]
    payload: str


class ChatResponse(BaseModel):
    reply: str
    action: Optional[ChatAction] = None


# ---------------------------------------------------------------------------
# Tool definitions (Gemini function-declaration format)
# ---------------------------------------------------------------------------
USER_TOOLS = [
    {
        "name": "navigate_to_page",
        "description": "Send the user to a page in the app.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "path": {"type": "STRING", "description": "e.g. /learn-hub, /job-check, /dashboard, /all-reports"}
            },
            "required": ["path"],
        },
    },
    {
        "name": "create_report",
        "description": "File a community report once category, district, and description are known.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "category": {"type": "STRING", "description": "e.g. phishing, scam_call, fake_job, other"},
                "district_name": {"type": "STRING", "description": "District name as the user said it"},
                "description": {"type": "STRING"},
            },
            "required": ["category", "district_name", "description"],
        },
    },
    {
        "name": "check_my_reports",
        "description": "Look up the current user's own submitted reports and their status.",
        "parameters": {"type": "OBJECT", "properties": {}},
    },
    {
        "name": "list_learn_hub_lessons",
        "description": "List learn-hub tiers and lessons, optionally filtered by a topic keyword.",
        "parameters": {
            "type": "OBJECT",
            "properties": {"topic": {"type": "STRING", "description": "Optional keyword, e.g. 'phishing'"}},
        },
    },
    {
        "name": "get_learn_hub_lesson",
        "description": "Fetch one lesson's content to explain or summarize it.",
        "parameters": {
            "type": "OBJECT",
            "properties": {"lesson_id": {"type": "STRING"}},
            "required": ["lesson_id"],
        },
    },
]

ADMIN_TOOLS = [
    {
        "name": "search_users",
        "description": "Search users by name/email, optionally filtered by role.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query": {"type": "STRING"},
                "role": {"type": "STRING", "description": "citizen or admin"},
            },
        },
    },
    {
        "name": "delete_user",
        "description": "Permanently delete a user. Only call after the admin has explicitly confirmed.",
        "parameters": {
            "type": "OBJECT",
            "properties": {"user_id": {"type": "STRING"}},
            "required": ["user_id"],
        },
    },
    {
        "name": "list_pending_reports",
        "description": "List reports awaiting moderation.",
        "parameters": {"type": "OBJECT", "properties": {}},
    },
    {
        "name": "moderate_report",
        "description": "Approve or reject a pending report. Only call after explicit admin confirmation.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "report_id": {"type": "STRING"},
                "decision": {"type": "STRING", "description": "approve or reject"},
            },
            "required": ["report_id", "decision"],
        },
    },
]


# ---------------------------------------------------------------------------
# Tool execution — same DB logic as before, untouched
# ---------------------------------------------------------------------------
def execute_tool(tool_name: str, tool_input: dict, current_user: User, db: Session):
    if tool_name == "navigate_to_page":
        path = tool_input["path"]
        return {"status": "ok", "navigated_to": path}, ChatAction(type="navigate", payload=path)

    if tool_name == "create_report":
        district = (
            db.query(District)
            .filter(
                (District.name_en.ilike(f"%{tool_input['district_name']}%"))
                | (District.name_bn.ilike(f"%{tool_input['district_name']}%"))
            )
            .first()
        )
        if not district:
            return {"error": f"Couldn't find a district matching '{tool_input['district_name']}'."}, None

        report = CommunityReport(
            user_id=current_user.id,
            district_id=district.id,
            category=tool_input["category"],
            description=tool_input["description"],
            status="pending",
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return {"status": "created", "report_id": str(report.id), "district": district.name_en}, None

    if tool_name == "check_my_reports":
        reports = (
            db.query(CommunityReport)
            .filter(CommunityReport.user_id == current_user.id)
            .order_by(CommunityReport.created_at.desc())
            .limit(10)
            .all()
        )
        return {
            "reports": [
                {"id": str(r.id), "category": r.category, "status": r.status, "created_at": str(r.created_at)}
                for r in reports
            ]
        }, None

    if tool_name == "list_learn_hub_lessons":
        query = db.query(Lesson)
        if tool_input.get("topic"):
            kw = tool_input["topic"]
            query = query.filter(
                (Lesson.title_en.ilike(f"%{kw}%")) | (Lesson.title_bn.ilike(f"%{kw}%"))
            )
        lessons = query.order_by(Lesson.tier_id, Lesson.order_index).limit(15).all()
        return {
            "lessons": [{"id": str(l.id), "tier_id": l.tier_id, "title": l.title_en} for l in lessons]
        }, None

    if tool_name == "get_learn_hub_lesson":
        lesson = db.query(Lesson).filter(Lesson.id == tool_input["lesson_id"]).first()
        if not lesson:
            return {"error": "Lesson not found."}, None
        path = f"/learn-hub/{lesson.tier_id}/lesson/{lesson.id}"
        return {"title": lesson.title_en, "content": lesson.content_en, "path": path}, None

    if tool_name == "search_users":
        query = db.query(User)
        if tool_input.get("query"):
            q = tool_input["query"]
            query = query.filter((User.full_name.ilike(f"%{q}%")) | (User.email.ilike(f"%{q}%")))
        if tool_input.get("role"):
            query = query.filter(User.role == tool_input["role"])
        users = query.limit(15).all()
        return {"users": [{"id": str(u.id), "name": u.full_name, "email": u.email, "role": u.role} for u in users]}, None

    if tool_name == "delete_user":
        if str(current_user.id) == tool_input["user_id"]:
            return {"error": "You can't delete your own admin account."}, None
        user = db.query(User).filter(User.id == tool_input["user_id"]).first()
        if not user:
            return {"error": "User not found."}, None
        db.delete(user)
        db.commit()
        return {"status": "deleted", "user_id": tool_input["user_id"]}, None

    if tool_name == "list_pending_reports":
        reports = (
            db.query(CommunityReport)
            .filter(CommunityReport.status == "pending")
            .order_by(CommunityReport.created_at.desc())
            .limit(15)
            .all()
        )
        return {
            "reports": [{"id": str(r.id), "category": r.category, "description": r.description[:100]} for r in reports]
        }, None

    if tool_name == "moderate_report":
        report = db.query(CommunityReport).filter(CommunityReport.id == tool_input["report_id"]).first()
        if not report:
            return {"error": "Report not found."}, None
        report.status = "approved" if tool_input["decision"] == "approve" else "rejected"
        db.commit()
        return {"status": "updated", "report_id": tool_input["report_id"], "new_status": report.status}, None

    raise ValueError(f"Unknown tool: {tool_name}")


SYSTEM_PROMPT = """You are the in-app assistant for CyberShurokkha 360, a
civic platform for reporting scams, checking suspicious jobs/URLs, and
learning digital safety. Be concise. When filing a report, ask for whatever
of category / district / description is missing before calling
create_report. For delete_user or moderate_report, always ask the admin to
confirm in plain language first. Prefer navigate_to_page over just
describing where something is."""


def build_contents(history: list[ChatMessage], message: str) -> list[types.Content]:
    contents = []
    for m in history:
        role = "model" if m.role == "assistant" else "user"
        contents.append(types.Content(role=role, parts=[types.Part(text=m.content)]))
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))
    return contents


@router.post("", response_model=ChatResponse)
def chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tools = USER_TOOLS + (ADMIN_TOOLS if current_user.role == "admin" else [])
    contents = build_contents(req.history, req.message)

    config = types.GenerateContentConfig(
        system_instruction=SYSTEM_PROMPT,
        tools=[types.Tool(function_declarations=tools)],
    )

    action: Optional[ChatAction] = None

    for _ in range(5):
        response = client.models.generate_content(model=MODEL, contents=contents, config=config)
        candidate = response.candidates[0]
        function_calls = [p.function_call for p in candidate.content.parts if p.function_call]

        if not function_calls:
            final_text = "".join(p.text for p in candidate.content.parts if p.text)
            return ChatResponse(reply=final_text, action=action)

        contents.append(candidate.content)

        response_parts = []
        for fc in function_calls:
            try:
                result, maybe_action = execute_tool(fc.name, dict(fc.args), current_user, db)
                if maybe_action:
                    action = maybe_action
            except Exception as e:
                result = {"error": str(e)}
            response_parts.append(types.Part.from_function_response(name=fc.name, response=result))

        contents.append(types.Content(role="user", parts=response_parts))

    raise HTTPException(status_code=500, detail="Chat loop did not resolve.")