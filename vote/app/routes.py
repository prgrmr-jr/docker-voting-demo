from flask import Blueprint, request, jsonify, render_template
from .redis_client import r
from .db import get_db_connection
import json

bp = Blueprint("vote", __name__)


@bp.route("/")
def index():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name FROM courses ORDER BY id;")
    courses = cursor.fetchall()
    cursor.close()
    conn.close()

    return render_template("index.html", courses=courses)


@bp.route("/vote", methods=["POST"])
def vote():
    data = request.json
    course_id = data.get("course_id")
    session_id = data.get("session_id")

    if not course_id or not session_id:
        return jsonify({"error": "course_id and session_id required"}), 400

    vote_data = {
        "course_id": course_id,
        "session_id": session_id,
    }

    r.lpush("votes_queue", json.dumps(vote_data))

    r.hset("user_votes", session_id, course_id)

    return jsonify({"status": "vote recorded", "course_id": course_id, "session_id": session_id})
